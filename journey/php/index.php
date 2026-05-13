<?php


// Setting the header to accept and return JSON
header('Content-Type: text/html');
header('Access-Control-Allow-Methods: POST');

$input = json_decode(file_get_contents("php://input"), true);

// Defined parameters from the user input, should also be validated later on.
$age = !empty($input['age']) ? $input['age'] : 'Unknown';
$weight = !empty($input['weight']) ? $input['weight'] : 'Unknown';
$targetWeight = !empty($input['targetWeight']) ? $input['targetWeight'] : 'Unknown';
$height = !empty($input['height']) ? $input['height'] : 'Unknown';
$gender = !empty($input['gender']) ? $input['gender'] : 'Unknown';
$goal = !empty($input['goal']) ? $input['goal'] : 'Unknown';

$experienceLevel = !empty($input['experienceLevel']) ? $input['experienceLevel'] : 'Beginner';
$trainingFrequency = !empty($input['trainingFrequency']) ? $input['trainingFrequency'] : 'Gym';
$menuPreference = !empty($input['menuPreference']) ? $input['menuPreference'] : 'None';
$limitations = !empty($input['limitations']) ? $input['limitations'] : 'None';
$activityLevel = !empty($input['activityLevel']) ? $input['activityLevel'] : 'Sedentary';
$averageSleep = !empty($input['averageSleep']) ? $input['averageSleep'] : 'Unknown';
$hydrationLevel = !empty($input['hydrationLevel']) ? $input['hydrationLevel'] : 'Unknown';
$dietHurdles = 'None';

if (!empty($input['dietHurdles']) && is_array($input['dietHurdles'])) {
    $dietHurdles = implode(', ', $input['dietHurdles']);
}

// Defined Schemas into the Gemini Scheme Format
$nutritionSchema = [
    'type' => 'OBJECT',
    'properties' => [
        'title' => ['type' => 'STRING', 'description' => "e.g, 'Plan A: Performance (Training Days)' Changes based on the user's goal"],
        'breakfast' => ['type' => 'STRING', 'description' => "Breakfast ingredients (max 25 chars) e.g, 80g Oats + 1 Scoop Protein + Fruit"],
        'lunch' => ['type' => 'STRING', 'description' => "Lunch ingredients (max 25 chars) e.g, 150g Chicken + 1 Cup Rice + Broccoli"],
        'snack' => ['type' => 'STRING', 'description' => "Snack ingredients (max 25 chars)"],
        'dinner' => ['type' => 'STRING', 'description' => "Dinner ingredients (max 25 chars)"],
    ],
    'required' => ['title', 'breakfast', 'lunch', 'snack', 'dinner']
];

$workoutSchema = [
    'type' => 'OBJECT',
    'properties' => [
        'days' => [
            'type' => 'STRING',
            'enum' => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        ],
        'target' => [
            'type' => 'STRING',
            'description' => "Target of muscle group or focus, e.g, 'Chest & Triceps' or 'Active Rest'"
        ],
        'exerises' => [
            'type' => 'ARRAY',
            'items' => ['type' => 'STRING'],
            'description' => "An array of up to 3 exercises e.g., ['Bench Press: 4 Sets x 8-10 Reps']"
        ]
    ],
    'required' => ['days', 'target', 'exerises']
];

$userSchema = [
    'type' => 'OBJECT',
    'properties' => [
        'body_fat' => ['type' => 'NUMBER', 'description' => "Percentage of the user's body fat."],
        'calories' => ['type' => 'NUMBER', 'description' => "Daily calories required. e.g, 2300"],
        'protein' => ['type' => 'NUMBER', 'description' => "Daily protein required."],
        'carbs' => ['type' => 'NUMBER', 'description' => "Daily carbs required."],
        'fats' => ['type' => 'NUMBER', 'description' => "Daily fats required."],
        'positive_habits' => [
            'type' => 'ARRAY',
            'items' => ['type' => 'STRING'],
            'description' => "An array of exactly 3 positive habits to encourage."
        ],
        'negative_habits' => [
            'type' => 'ARRAY',
            'items' => ['type' => 'STRING'],
            'description' => "An array of exactly 3 negative habits to avoid. ONLY if there's any bad habits specified by the user"
        ],
        'advice' => ['type' => 'STRING', 'description' => "Provide actionable advice for the user based on provided plan (A or B) and fitness goal."]
    ],
    'required' => ['body_fat', 'calories', 'protein', 'carbs', 'fats', 'positive_habits', 'negative_habits', 'advice']
];

$fitnessSchema = [
    'type' => 'OBJECT',
    'properties' => [
        'personalPlan' => $userSchema,
        'workoutPlan' => [
            'type' => 'ARRAY',
            'items' => $workoutSchema,
            'description' => "The 7-day workout schedule"
        ],
        'nutritionPlan' => [
            'type' => 'OBJECT',
            'properties' => [
                'planA' => $nutritionSchema,
                'planB' => $nutritionSchema
            ],
            'required' => ['planA', 'planB']
        ]
    ],
    'required' => ['personalPlan', 'workoutPlan', 'nutritionPlan']
];

// Defined model and api key for accepting prompts and payloads
$apiKey = ""; 
$model = "gemini-3-flash-preview";
$url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";

$prompt = "User Profile:\n" .
    "- Age: {$age}\n" .
    "- Weight: {$weight}kg\n" .
    "- Target Weight: {$targetWeight}kg\n" .
    "- Height: {$height}cm\n" .
    "- Gender: {$gender}\n" .
    "- Goal: {$goal}\n" .
    "- Experience Level: {$experienceLevel}\n" .
    "- Training Frequency: {$trainingFrequency}\n" .
    "- Menu Preference: {$menuPreference}\n" .
    "- Limitations/Injuries: {$limitations}\n" .
    "- Daily Activity Level: {$activityLevel}\n" .
    "- Average Sleep: {$averageSleep}\n" .
    "- Hydration Level: {$hydrationLevel}\n" .
    "- Hurdles: {$dietHurdles}\n\n";

$instructions = "1. Tailor exercises strictly within the gym (since the user is the memeber of the gym) and 'Experience Level'.\n" .
    "2. DO NOT include any exercises that could aggravate the listed 'Limitations/Injuries'. Futhermore, if the user intentionally input unrealistic or inappropriate statement within the 'Limitations/Injuries'; completely exclude it.\n" .
    "3. Ensure recipes and meal ingredients strictly follow the 'Menu Preference' (e.g., if Vegan, no meat/dairy).\n" .
    "4. Include the 'positive_habits' on their goals. For 'negative_habits', if the user listed 'None' for Hurdles, leave the array completely EMPTY[]. Do not invent bad habits.\n" .
    "5. Provide actionable, descriptive advice that specifically addresses how working towards their 'Goal'/'Targets' and optional plans from A or B.\n" .
    "6. Ensure that the workout changes based on with user's 'Traning Frequency'. Such as 5 / weekly with 2 breaks";

$payload = [
    "systemInstruction" => [
        "parts" => [
            ["text" => "You are a professional 'Genius Gym' AI. You will generate a highly personalised fitness & nutrition plan based on the user profile. Output ONLY valid, raw JSON. Do not output markdown code blocks."]
        ]
    ],
    "contents" => [
        [
            "role" => "user",
            "parts" => [
                ["text" => $prompt . $instructions]
            ]
        ]
    ],
    "generationConfig" => [
        "temperature" => 0.5,
        "responseMimeType" => "application/json",
        "responseSchema" => $fitnessSchema
    ]
];

// Executing the API by using the cURL
$curl = curl_init($url);
curl_setopt($curl, CURLOPT_FORBID_REUSE, true); // This should acts as a replacement towards curl_close()
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($payload));

$response = curl_exec($curl);

if (curl_errno($curl)) {
    http_response_code(500);
    echo json_encode(["error" => "Curl error: " . curl_error($ch)]);
    exit;
}

// Extract the data from the response body
$responseData = json_decode($response, true);
$rawJsonString = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;

if (!$rawJsonString) {
    die("<div style='padding: 20px; color: red;'><h1>Error: AI Processing Failed.</h1><p>The AI could not generate the plan. Please check your inputs and try again.</p></div>");
}

$plan = json_decode($rawJsonString, true);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Fitness & Nutrition Guide</title>
    <style>
        @page {
            margin: 0px;
            size: A4 portrait;
        }

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: white !important;
            color: #333333;
            font-size: 13px;
            text-align: left !important;
        }

        .page-container {
            border-collapse: collapse;
            table-layout: fixed;
            width: 794px !important;
            height: 1120px !important;
            overflow: hidden !important;
        }

        .sidebar {
            width: 28%;
            background-color: #1a2228;
            color: #d1d5db;
            vertical-align: top;
            padding: 30px 20px;
        }

        .main-content {
            width: 72%;
            background-color: #f8f9fa;
            vertical-align: top;
            /*padding: 30px 25px;*/
            padding: 0 !important;
        }

        .brand-title {
            color: #1ebaa2;
            font-size: 24px;
            font-weight: bold;
            margin-top: 0;
            margin-bottom: 30px;
            text-transform: uppercase;
        }

        .sidebar h3 {
            color: #1ebaa2;
            font-size: 14px;
            text-transform: uppercase;
            border-bottom: 1px solid #374151;
            padding-bottom: 8px;
            margin-top: 30px;
            margin-bottom: 15px;
        }

        .sidebar p {
            font-size: 13px;
            line-height: 1.6;
            margin: 0 0 8px 0;
        }

        .sidebar .label {
            font-weight: bold;
            color: #ffffff;
            text-align: left;
        }

        .main-header h1 {
            font-size: 32px;
            color: #1a2228;
            margin: 0 0 10px 0;
        }

        .main-header p {
            font-size: 16px;
            color: #4b5563;
            margin: 0 0 15px 0;
        }

        .header-divider {
            height: 5px;
            background-color: #1ebaa2;
            margin-bottom: 20px;
        }

        .section-heading {
            background-color: #1a2228;
            color: #ffffff;
            padding: 12px 15px;
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .table-container {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            margin-bottom: 20px;
            padding: 12px;
        }

        .schedule-table {
            width: 100%;
            border-collapse: collapse;
        }

        .schedule-table thead tr:first-child {
            border-bottom: 3px solid #1ebaa2;
        }

        .schedule-table th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 8px 10px;
            font-size: 13px;
            color: #1a2228;
            font-weight: bold;
            border-bottom: 1px solid #e5e7eb;
        }

        .schedule-table td {
            padding: 8px 10px;
            font-size: 12px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
            line-height: 1.5;
            color: #374151;
        }

        .schedule-table tr:last-child td {
            border-bottom: none;
        }

        .day-col {
            color: #1ebaa2 !important;
            font-weight: bold;
            width: 16%;
        }

        .target-col {
            font-weight: bold;
            color: #1a2228 !important;
            width: 22%;
        }

        .diet-container {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            table-layout: fixed;
        }

        .diet-card {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-top: 3px solid #1a2228;
            padding: 15px;
            vertical-align: top;
            width: 48%;
        }

        .diet-card--focus {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-top: 3px solid #1ebaa2;
            padding: 15px;
            vertical-align: top;
            width: 48%;
        }

        .diet-spacer {
            width: 4%;
        }

        .diet-title {
            font-size: 15px;
            font-weight: bold;
            color: #1a2228;
            margin-bottom: 12px;
        }

        .diet-card--focus p,
        .diet-card p {
            font-size: 12px;
            line-height: 1.6;
            margin: 0;
            color: #374151;
        }

        .diet-card--focus .label,
        .diet-card .label {
            font-weight: bold;
            color: #1a2228;
        }

        .advice-box {
            background-color: #ecfdf5;
            border-left: 5px solid #1ebaa2;
            padding: 15px;
            margin-bottom: 15px;
        }

        .advice-box h2 {
            font-size: 18px;
            color: #1a2228;
            margin: 0 0 10px 0;
        }

        .advice-box p {
            font-size: 13px;
            line-height: 1.6;
            color: #374151;
            margin: 0;
        }

        .footer {
            position: absolute;
            bottom: 20px;
            left: 0;
            width: 100%;
            text-align: center !important;
            font-size: 11px;
            color: #9ca3af;
        }

        .content-wrapper {
            position: relative;
            height: 1120px !important; 
            padding: 30px 35px;
            box-sizing: border-box;
        }

        .advice-box,
        .diet-card,
        .diet-card--focus,
        tr {
            page-break-inside: avoid;
        }
    </style>
</head>

<body>
    <table class="page-container">
        <tr>
            <!-- Sidebar Column -->
            <td class="sidebar">
                <h1 class="brand-title">GYM GENIUS</h1>

                <h3>USER INFO</h3>
                <p>
                    <span class="label">Age:</span> <?= htmlspecialchars($age) ?> &verbar;
                    <span class="label">Weight:</span> <?= htmlspecialchars($weight) ?>
                </p>
                <p>
                    <span class="label">Height:</span>
                    <?= htmlspecialchars($height) ?>
                </p>
                <p>
                    <span class="label">Goal: </span>Build Muscle
                </p>
                <p>
                    <span class="label">Experience: </span>Begineer
                </p>
                <p>
                    <span class="label">Location: </span>Gym
                </p>

                <h3>DAILY TARGETS</h3>
                <p><span class="label">Calories:</span>
                    <?= number_format($plan['personalPlan']['calories']) ?> kcal
                </p>
                <p><span class="label">Protein:</span>
                    <?= htmlspecialchars($plan['personalPlan']['protein']) ?>g
                </p>
                <p><span class="label">Carbs:</span>
                    <?= htmlspecialchars($plan['personalPlan']['carbs']) ?>g | <span class="label">Fats:</span>
                    <?= htmlspecialchars($plan['personalPlan']['fats']) ?>g
                </p>

                <h3>HABITS TO BUILD</h3>
                <?php foreach ($plan['personalPlan']['positive_habits'] as $habit): ?>
                    <p>•
                        <?= htmlspecialchars($habit) ?>
                    </p>
                <?php endforeach; ?>

                <?php
                // Filter out any blank habits or generic 'None' strings the AI might spit out
                $badHabits = array_filter($plan['personalPlan']['negative_habits'], function ($h) {
                    return trim($h) !== '' && strtolower(trim($h)) !== 'none';
                });
                ?>

                <h3>HABITS TO AVOID</h3>
                <?php if (count($badHabits) > 0): ?>
                    <?php foreach ($badHabits as $habit): ?>
                        <p>• <?= htmlspecialchars($habit) ?></p>
                    <?php endforeach; ?>
                <?php endif; ?>
            </td>

            <!-- Main Content Column -->
            <td class="main-content">
                <div class="content-wrapper">
                    <div class="main-header">
                        <h1>Fitness & Nutrition Plan</h1>
                        <p>Unified Exercise & Nutritional Structure</p>
                        <div class="header-divider"></div>
                    </div>

                    <div class="section-heading">Weekly Workout Plans</div>

                    <div class="table-container">
                        <table class="schedule-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Target</th>
                                    <th>Exercises, Sets & Reps</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($plan['workoutPlan'] as $day): ?>
                                    <tr>
                                        <td class="day-col">
                                            <?= htmlspecialchars($day['days']) ?>
                                        </td>
                                        <td class="target-col">
                                            <?= nl2br(htmlspecialchars($day['target'])) ?>
                                        </td>
                                        <td>
                                            <?php foreach ($day['exerises'] as $exercise): ?>
                                                •
                                                <?= htmlspecialchars($exercise) ?><br>
                                            <?php endforeach; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <div class="section-heading">Nutritional Plans (
                        <?= number_format($plan['personalPlan']['calories']) ?> kcal)
                    </div>

                    <table class="diet-container">
                        <tr>
                            <td class="diet-card--focus">
                                <div class="diet-title">
                                    <?= htmlspecialchars($plan['nutritionPlan']['planA']['title']) ?>
                                </div>
                                <p>
                                    <span class="label">B-fast:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planA']['breakfast']) ?><br>
                                    <span class="label">Lunch:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planA']['lunch']) ?><br>
                                    <span class="label">Snack:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planA']['snack']) ?><br>
                                    <span class="label">Dinner:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planA']['dinner']) ?>
                                </p>
                            </td>
                            <td class="diet-spacer"></td>
                            <td class="diet-card">
                                <div class="diet-title">
                                    <?= htmlspecialchars($plan['nutritionPlan']['planB']['title']) ?>
                                </div>
                                <p>
                                    <span class="label">B-fast:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planB']['breakfast']) ?><br>
                                    <span class="label">Lunch:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planB']['lunch']) ?><br>
                                    <span class="label">Snack:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planB']['snack']) ?><br>
                                    <span class="label">Dinner:</span>
                                    <?= htmlspecialchars($plan['nutritionPlan']['planB']['dinner']) ?>
                                </p>
                            </td>
                        </tr>
                    </table>

                    // TODO: Fix the issue with disappearing actionable advice
                    <div class="advice-box">
                        <h2>Actionable Advice</h2>
                        <p>
                            <?= nl2br(htmlspecialchars($plan['personalPlan']['advice'])) ?>
                            <b>Always consult a fitness professional or GP before starting a new exercise.</b>
                        </p>
                    </div>

                    <div class="footer">
                        GYM GENIUS &copy; <?= date("Y") ?>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>

</html>