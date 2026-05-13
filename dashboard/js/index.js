window.addEventListener("load", init)

function init(e) {

    const screenLoader = document.querySelector("#screen-loader");

    function fadeIn() {
        return new Promise((resolve) => {
            setTimeout(() => {
                screenLoader.classList.replace("u-fade-out", "u-fade-in");
                const handleTransition = () => {

                    screenLoader.removeEventListener("transitionend", handleTransition);
                    resolve();
                };

                screenLoader.addEventListener("transitionend", handleTransition);
            }, 500);
        });
    }

    function fadeOut() {
        return new Promise((resolve) => {
            setTimeout(() => {
                screenLoader.classList.replace("u-fade-in", "u-fade-out");
                const handleTransition = () => {
                    screenLoader.removeEventListener("transitionend", handleTransition);
                    resolve();
                };

                screenLoader.addEventListener("transitionend", handleTransition);
            }, 500);
        });
    }

    fadeOut();

    const pageBody = document.querySelector("#page-body");
    const headerContainer = document.querySelector("#header-container");

    const signInContainer = document.querySelector("#signin-container");
    const signInSwitchBtn = document.querySelector("#signin-switch-btn");

    const logInContainer = document.querySelector("#login-container");
    const logInSwitchBtn = document.querySelector("#login-switch-btn");

    signInSwitchBtn.addEventListener("click", () => {
        if (logInContainer.classList.contains("u-hidden")) {
            signInContainer.classList.toggle("u-hidden");
            logInContainer.classList.toggle("u-hidden");
        }
    })
    logInSwitchBtn.addEventListener("click", () => {
        if (signInContainer.classList.contains("u-hidden")) {
            signInContainer.classList.toggle("u-hidden");
            logInContainer.classList.toggle("u-hidden");
        }
    })

    const logInBtn = document.querySelector("#login-btn");
    const registrationContainer = document.querySelector("#registration-container");
    const dashboardContainer = document.querySelector("#dashboard-container");

    const dashboardBlob = document.querySelector("#dashboard-blob")
    const submissionBlob = document.querySelector("#submission-blob")

    const logoUpload = document.querySelector("#logo-upload");
    const logoImg = document.querySelector("#logo-img")
    const previewImg = document.querySelector("#submission-logo-img");
    const primaryColor = document.querySelector("#primary-color-picker");
    const secondaryColor = document.querySelector("#secondary-color-picker");

    logoUpload.addEventListener("change", (event) => {
        let objectURL = URL.createObjectURL(event.target.files[0]);
        if (objectURL) {
            logoImg.src = objectURL;
            previewImg.src = objectURL;
        }
    })

    primaryColor.addEventListener("input", (event) => {
        pageBody.style.background = `radial-gradient(circle at 30% 70%, ${event.target.value} 0%, #000000 70%)`;
    });

    secondaryColor.addEventListener("input", (event) => {
        let linearColor = `linear-gradient(135deg, #000000 0%, ${event.target.value} 100%)`;
        submissionBlob.style.background = linearColor;
        dashboardBlob.style.background = linearColor;
    });

    logInBtn.addEventListener("click", (event) => {
        event.preventDefault();
        (async () => {
            await fadeIn();
            headerContainer.classList.toggle("u-hidden");
            registrationContainer.classList.toggle("u-hidden");
            dashboardContainer.classList.toggle("u-hidden");
            pageBody.classList.replace("page-body--registration", "page-body--dashboard")
            logInBtn.removeEventListener("click", this);
            fadeOut();
        })()
    }, { once: true })

    const submissionContainer = document.querySelector("#submission-container");
    const dashboardAnalyticsContainer = document.querySelector("#dashboard-nav-analytics");
    const dashboardCustomContainer = document.querySelector("#dashboard-nav-custom");

    const dashboardHomeBtn = document.querySelector("#dashboard-home-button");
    const dashboardCustomBtn = document.querySelector("#dashboard-custom-button");
    const dashboardPreviewBtn = document.querySelector("#dashboard-preview-button")

    dashboardPreviewBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (submissionContainer.classList.contains("u-hidden")) {
            (async () => {
                await fadeIn();
                headerContainer.classList.toggle("u-hidden");
                submissionContainer.classList.toggle("u-hidden")
                dashboardContainer.classList.toggle("u-hidden");
                pageBody.classList.replace("page-body--dashboard", "page-body--submission")
                fadeOut();
            })()
        }
    }, { once: true })
    dashboardHomeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!dashboardCustomContainer.classList.contains("u-hidden")) {
            dashboardAnalyticsContainer.classList.toggle("u-hidden");
            dashboardCustomContainer.classList.toggle("u-hidden");
        }
    })
    dashboardCustomBtn.addEventListener("click", (event) => {
        event.preventDefault();
        if (!dashboardAnalyticsContainer.classList.contains("u-hidden")) {
            dashboardAnalyticsContainer.classList.toggle("u-hidden");
            dashboardCustomContainer.classList.toggle("u-hidden");
        }
    })

    const submissionbtn = document.querySelector("#submission-btn");
    const submissionbtnOne = document.querySelector("#submission-btn-one")
    const submissionbtnTwo = document.querySelector("#submission-btn-two")

    const stepIndicatorOne = document.querySelector("#step-indicator-one");
    const stepIndicatorTwo = document.querySelector("#step-indicator-two");
    const stepIndicatorThree = document.querySelector("#step-indicator-three");
    const stepIndicatorFour = document.querySelector("#step-indicator-four");

    const submissionContainerOne = document.querySelector("#submission-container-one");
    const submissionContainerTwo = document.querySelector("#submission-container-two");
    const submissionContainerThree = document.querySelector("#submission-container-three");
    const submissionContainerFour = document.querySelector("#submission-container-four");
    const submissionContainerFive = document.querySelector("#submission-container-five");

    submissionbtn.addEventListener("click", (event) => {
        event.preventDefault();
        submissionContainerOne.classList.toggle("u-hidden")
        submissionContainerTwo.classList.toggle("u-hidden")
        stepIndicatorOne.classList.add("step-indicator__item--completed")
        stepIndicatorTwo.classList.add("step-indicator__item--active")
    })

    submissionbtnOne.addEventListener("click", (event) => {
        event.preventDefault();
        submissionContainerTwo.classList.toggle("u-hidden")
        submissionContainerThree.classList.toggle("u-hidden")
        stepIndicatorTwo.classList.add("step-indicator__item--completed")
        stepIndicatorThree.classList.add("step-indicator__item--active")
    })

    submissionbtnTwo.addEventListener("click", (event) => {
        event.preventDefault();

        submissionContainerThree.classList.toggle("u-hidden");
        submissionContainerFour.classList.toggle("u-hidden");
        stepIndicatorThree.classList.add("step-indicator__item--completed");
        stepIndicatorFour.classList.add("step-indicator__item--active");

        (async function () {
            const processingItem = document.querySelector("#processing-item-one");
            const processingItemTwo = document.querySelector("#processing-item-two");
            const processingItemThree = document.querySelector("#processing-item-three");

            const processingItemIcon = document.querySelector("#processing-icon-one");
            const processingItemIconTwo = document.querySelector("#processing-icon-two");
            const processingItemIconThree = document.querySelector("#processing-icon-three");

            let duration = 2000 // 2000ms -> 2s

            console.log("starting" + processingItem)

            // Simulate the server-side AI for processing and generating the fitness plan based on the form submission.
            const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            wait(duration)
                .then(() => {
                    processingItem.classList.replace("processing-list__item--loading", "processing-list__item--completed");
                    processingItemIcon.textContent = "check_circle";
                    return wait(duration);
                })
                .then(() => {
                    processingItemTwo.classList.replace("processing-list__item--loading", "processing-list__item--completed");
                    processingItemIconTwo.textContent = "check_circle";
                    return wait(duration);
                })
                .then(() => {
                    processingItemThree.classList.replace("processing-list__item--loading", "processing-list__item--completed");
                    processingItemIconThree.textContent = "check_circle";
                    return wait(duration * 0.5);
                }).then(() => {
                    stepIndicatorFour.classList.add("step-indicator__item--completed")
                    submissionContainerFour.classList.toggle("u-hidden")
                    submissionContainerFive.classList.toggle("u-hidden")
                }).catch(error => alert(error));
        })();
    })
}