window.addEventListener("load", () => {

    let userProfile = {};

    let currentContainer = document.querySelector('#submission-container-one');
    let generating = false;
    var selectedGoal = null;
    var selected = null;

    // Form Containers
    const container1 = document.querySelector('#submission-container-one');
    const container2 = document.querySelector('#submission-container-two');
    const container3 = document.querySelector('#submission-container-three');
    const container4 = document.querySelector('#submission-container-four');
    const container5 = document.querySelector('#submission-container-five');
    const container6 = document.querySelector('#submission-container-six');
    const container7 = document.querySelector('#submission-container-seven');
    const container8 = document.querySelector('#submission-container-eight');

    // Navigation Buttons (Forward)
    const btnNext1 = document.querySelector('#submission-btn');
    const btnNext2 = document.querySelector('#submission-btn-one');
    const btnNext3 = document.querySelector('#submission-btn-two');
    const btnNext4 = document.querySelector('#submission-btn-three');
    const btnNext5 = document.querySelector('#submission-btn-four');
    const btnNext6 = document.querySelector("#submission-btn-five")

    // Navigation Buttons (Backwards)
    const btnPrev1 = document.querySelector('#prev-btn-one');
    const btnPrev2 = document.querySelector('#prev-btn-two');
    const btnPrev3 = document.querySelector('#prev-btn-three');
    const btnPrev4 = document.querySelector('#prev-btn-four');

    // Step Indicators
    const indicators = [
        document.querySelector('#step-indicator-one'),   // 0: Biometric
        document.querySelector('#step-indicator-two'),   // 1: Goals
        document.querySelector('#step-indicator-three'), // 2: Preferences
        document.querySelector('#step-indicator-four'),  // 3: Lifestyles
        document.querySelector('#step-indicator-five')   // 4: Generation
    ];

    // Goal Cards
    const goalCards = document.querySelectorAll('.auth-form__card');

    // Toggle visiability between containers
    function switchStep(hideContainer, showContainer) {
        hideContainer.classList.add('u-fade-out');
        currentContainer = showContainer;

        setTimeout(() => {
            hideContainer.classList.add('u-hidden');
            hideContainer.classList.remove("u-fade-out");

            showContainer.classList.remove('u-hidden');
            showContainer.classList.add('u-fade-out');

            setTimeout(() => {
                showContainer.classList.remove('u-fade-out');
            }, 10);
        }, 200);
    }

    // Update the top navigation indicators
    function updateIndicator(activeIndex) {
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('step-indicator__item--active', 'step-indicator__item--complete');
            if (index === activeIndex) {
                indicator.classList.add('step-indicator__item--active');
            } else if (index < activeIndex) {
                indicator.classList.add('step-indicator__item--completed');
            }
        });
    }

    // Update the cards that are unselected
    function updateCards(selected) {
        goalCards.forEach(card => {
            if (selected != card) {
                card.classList.remove("auth-form__card--selected")
            }
        })
    }

    goalCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle("auth-form__card--selected")
            selected = card;
            selectedGoal = card.getAttribute("value");

            updateCards(selected)
        });
    });

    function populateUserProfile() {
        buildUserProfile();

        const capitalise = (str) => {
            if (!str) return "None";
            return str.charAt(0).toUpperCase() + str.slice(1);
        };

        // Populate each user defined value inside the list
        document.querySelector('#confirm-age').textContent = userProfile.age + " Years";
        document.querySelector('#confirm-weight').textContent = userProfile.weight + " Kg";
        document.querySelector('#confirm-height').textContent = userProfile.height + " Cm";
        document.querySelector('#confirm-gender').textContent = capitalise(userProfile.gender);
        document.querySelector('#confirm-goal').textContent = userProfile.goal;
        document.querySelector('#confirm-target').textContent = userProfile.targetWeight + " Kg";

        document.querySelector('#confirm-experience').textContent = capitalise(userProfile.experienceLevel);
        document.querySelector('#confirm-frequency').textContent = userProfile.trainingFrequency + " Days/Week";
        document.querySelector('#confirm-menu').textContent = capitalise(userProfile.menuPreference);
        document.querySelector('#confirm-limitations').textContent = capitalise(userProfile.limitations);

        document.querySelector('#confirm-activity').textContent = capitalise(userProfile.activityLevel);
        document.querySelector('#confirm-sleep').textContent = userProfile.averageSleep + " Hours";
        document.querySelector('#confirm-hydration').textContent = userProfile.hydrationLevel + " L";

        // Join hurdles into a readable list, or display "None"
        document.querySelector('#confirm-hurdles').textContent =
            userProfile.dietHurdles.length > 0 ? userProfile.dietHurdles.join(', ') : "None";
    }

    function buildUserProfile() {
        const hurdleCheckboxes = document.querySelectorAll('.lifestyle-checkbox__input:checked');
        const dietHurdlesArray = Array.from(hurdleCheckboxes).map(checkb => checkb.value);
        let finalGoal = 0;

        switch (parseInt(selectedGoal)) {
            case 2:
                finalGoal = "Improve Definition"
                break;
            case 3:
                finalGoal = "Maintain Wellness"
                break;
            default:
                finalGoal = "Build Strength"
                break
        }

        // Gather all of the information before populating the user profile
        userProfile = {
            age: document.querySelector('#age-input').value,
            weight: document.querySelector('#weight-input').value,
            height: document.querySelector('#height-input').value,
            gender: document.querySelector('#gender-input').value,
            goal: finalGoal,
            targetWeight: document.querySelector('#target-weight-input').value,
            experienceLevel: document.querySelector('#experience-level').value,
            trainingFrequency: document.querySelector('#training-frequency').value,
            menuPreference: document.querySelector('#menu-preference').value,
            limitations: document.querySelector('#limitations-input').value,
            activityLevel: document.querySelector('#activity-level').value,
            averageSleep: document.querySelector('#sleep-input').value,
            hydrationLevel: document.querySelector('#hydration-input').value,
            dietHurdles: dietHurdlesArray
        };
    }

    function showError(selector, message) {
        alert(message);
        const element = document.querySelector(selector)
        if (element) {
            element.focus()
        }
        return false;
    }

    function validateDropdown(selector, array, errorMessage) {
        const select = document.querySelector(selector);

        // Fails if it is still on the default placeholder (index 0) or has no value

        if (!select || select.selectedIndex === 0 || select.value.trim() === "")
            return showError(selector, errorMessage);

        // Fails if its value doesn't match against the array

        if (!array.includes(select.value.toLowerCase()))
            return showError(selector, errorMessage + "\nThis selected option is invalid");

        return true;
    }

    function validateBiometrics() {
        // Gather required inputs to be validated
        const age = document.querySelector('#age-input').value;
        const weight = document.querySelector('#weight-input').value;
        const height = document.querySelector('#height-input').value;

        const allowedGenders = ["male", "female", "unknown"];

        if (!age || isNaN(age) || age < 14 || age > 80)
            return showError('#age-input', "Please enter a valid age between 14 and 70.");

        if (!weight || weight.length < 2)
            return showError('#weight-input', "Please enter your current weight.");

        if (!height || height.length < 2)
            return showError('#height-input', "Please enter your current height.");

        if (!validateDropdown('#gender-input', allowedGenders, "Please select your gender."))
            return false;

        return true;
    }

    function validateGoals() {
        if (!selectedGoal)
            return showError(null, "Please select a fitness goal by clicking one of shown cards.")

        const targetWeight = document.querySelector("#target-weight-input").value.trim();
        if (!targetWeight || targetWeight.length < 2)
            return showError('#target-weight-input', "Please enter your target weight.");

        return true;
    }

    function validatePreferences() {
        const allowedExperience = ["beginner", "intermediate", "advanced"];
        const allowedFrequency = ["6-7", "4-5", "2-3", ">2"];
        const allowedPreference = ["none", "vegetarian", "vegan", "keto", "pescatarian"];

        if (!validateDropdown('#experience-level', allowedExperience, "Please select your experience level."))
            return false;
        if (!validateDropdown('#training-frequency', allowedFrequency, "Please select your training frequency."))
            return false;
        if (!validateDropdown('#menu-preference', allowedPreference, "Please select a menu preference."))
            return false;

        return true;
    }

    function validateLifestyles() {
        const allowedLevel = ["sedentary", "light", "moderate", "active"];

        if (!validateDropdown('#activity-level', allowedLevel, "Please select your daily activity level."))
            return false;

        const sleep = document.querySelector('#sleep-input').value.trim();
        const hydration = document.querySelector('#hydration-input').value.trim();

        if (!sleep)
            return showError('#sleep-input', "Please enter your average sleep (e.g., 8 hours).");

        if (!hydration)
            return showError('#hydration-input', "Please enter your daily hydration level.");

        return true;
    }

    // Step 1 -> Step 2 (Intro -> Biometrics)
    btnNext1.addEventListener('click', (event) => {
        event.preventDefault();
        switchStep(container1, container2);
        updateIndicator(0);
    });

    // Step 2 -> Step 3 (Biometrics -> Goals)
    btnNext2.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container2)
            return;
        if (!validateBiometrics())
            return;
        switchStep(container2, container3);
        updateIndicator(1);
    });

    // Step 3 -> Step 4 (Goals -> Preferences)
    btnNext3.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container3)
            return;
        if (!validateGoals())
            return;
        switchStep(container3, container4);
        updateIndicator(2);
    });

    // Step 4 -> Step 5 (Preferences -> Lifestyles)
    btnNext4.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container4)
            return;
        if (!validatePreferences())
            return;
        switchStep(container4, container5);
        updateIndicator(3);
    });

    // Step 5 -> Step 6 (Lifestyles -> Confirmation)
    btnNext5.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container5)
            return;
        if (!validateLifestyles())
            return;
        switchStep(container5, container6);
        updateIndicator(4);

        populateUserProfile();
    });

    // Step 6 -> Step 7 (Confirmation -> AI Generation)
    btnNext6.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container6)
            return;
        switchStep(container6, container7);
        updateIndicator(5);

        processAIGeneration();
    });


    // Step 3 -> Step 2 (Goals -> Biometrics)
    btnPrev1.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container3)
            return;
        switchStep(container3, container2);
        updateIndicator(1);
    });

    // Step 4 -> Step 3 (Preferences -> Goals)
    btnPrev2.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container4)
            return;
        switchStep(container4, container3);
        updateIndicator(2);
    });

    // Step 5 - > Step 4 (Lifestyles -> Preferences)
    btnPrev3.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container5)
            return;
        switchStep(container5, container4);
        updateIndicator(3);
    });

    // Step 6 - > Step 5 (Confirmation -> Lifestyles)
    btnPrev4.addEventListener('click', (event) => {
        event.preventDefault();
        if (currentContainer != container6)
            return;
        switchStep(container6, container5);
        updateIndicator(4);
    });

    async function processAIGeneration() {
        if (generating == true) {
            return
        }
        generating = true;

        const item1 = document.querySelector('#processing-item-one');
        const icon1 = document.querySelector('#processing-icon-one');

        const item2 = document.querySelector('#processing-item-two');
        const icon2 = document.querySelector('#processing-icon-two');

        const item3 = document.querySelector('#processing-item-three');
        const icon3 = document.querySelector('#processing-icon-three');

        // Reset the state for each of the items and icons
        [item1, item2, item3].forEach(item => {
            item.classList.add('processing-list__item--loading');
            item.classList.remove('processing-list__item--completed');
        });

        [icon1, icon2, icon3].forEach(icon => {
            icon.textContent = 'progress_activity';
        });

        const markAsComplete = (itemElement, iconElement) => {
            itemElement.classList.remove('processing-list__item--loading');
            itemElement.classList.add('processing-list__item--completed')
            iconElement.textContent = "check_circle";
        };

        const uiStage1 = new Promise(resolve => setTimeout(() => {
            markAsComplete(item1, icon1); resolve();
        }, 3500));
        const uiStage2 = new Promise(resolve => setTimeout(() => {
            markAsComplete(item2, icon2); resolve();
        }, 7500));

        try {
            const api = await fetch("php/index.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userProfile)
            });

            // Wait for both the UI visual timers (stage 1 & 2) AND the API to finish
            const [response] = await Promise.all([api, uiStage1, uiStage2]);

            if (!response.ok) {
                throw new Error(`Internal Server Error: ${response.status}`);
            }

            // Get the generated HTML returned by PHP
            const generatedHtml = await response.text();

            if (generatedHtml.includes("Error:") || !generatedHtml.includes("page-container")) {
                throw new Error("AI Processing Failed: Unable to generate a plan.");
            }

            // Applying configurations for parsing the html into pdf
            const pdfOptions = {
                margin: 0,
                filename: "Gym-Genius-Plan.pdf",
                image: {
                    type: "jpeg",
                    quality: 0.98
                },
                html2canvas: {
                    scale: 4,
                    scrollY: 0,
                    useCORS: true
                },
                pagebreak: {
                    mode: 'avoid-all'
                },
                jsPDF: {
                    unit: 'in',
                    format: 'A4',
                    orientation: 'portrait'
                }
            }

            // Convert the generated HTML into a PDF blob
            const rawBlob = await html2pdf().set(pdfOptions).from(generatedHtml).output('blob');
            const pdfBlob = new Blob([rawBlob], {
                type: 'application/pdf'
            });

            // Create a temporary URL from the PDF blob
            const pdfURL = URL.createObjectURL(pdfBlob)

            markAsComplete(item3, icon3);

            // Delay the process of embedding the URL into the preview and download element
            setTimeout(() => {
                switchStep(container7, container8);

                const pdfPreview = document.querySelector('#submission-preview');
                const downloadBtn = document.querySelector('#download-btn');

                if (pdfPreview) {
                    pdfPreview.setAttribute('data', pdfURL);
                    const clone = pdfPreview.cloneNode(true);
                    pdfPreview.parentNode.replaceChild(clone, pdfPreview);
                };

                if (downloadBtn) {
                    downloadBtn.href = pdfURL;
                    downloadBtn.download = `Gym-Genius.pdf`;
                }
            }, 1000);
        } catch (error) {
            console.error('Error generating AI plan:', error);

            item3.classList.remove('processing-list__item--loading');

            setTimeout(() => {
                alert("The AI could not generate your plan right now. Please adjust your inputs or try again in a few moments.");
                switchStep(container7, container6);
                updateIndicator(4);
                generating = false;
            }, 1500);
        }
    }
});




