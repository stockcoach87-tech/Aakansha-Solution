"use strict";

document.addEventListener("DOMContentLoaded", () => {
    /* ---------------------------------------------------------
       MOBILE NAVIGATION
    --------------------------------------------------------- */
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("open");
            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("menu-open", isOpen);
        });

        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.classList.remove("menu-open");
            });
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && navMenu.classList.contains("open")) {
                navMenu.classList.remove("open");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                document.body.classList.remove("menu-open");
            }
        });
    }

    /* ---------------------------------------------------------
       ACTIVE NAVIGATION
    --------------------------------------------------------- */
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-menu a").forEach(link => {
        const href = link.getAttribute("href");

        if (href === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    /* ---------------------------------------------------------
       SCROLL REVEAL
    --------------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach(element => revealObserver.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }

    /* ---------------------------------------------------------
       FAQ ACCORDION
    --------------------------------------------------------- */
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        if (!question || !answer) return;

        question.setAttribute("aria-expanded", "false");

        question.addEventListener("click", () => {
            const wasOpen = item.classList.contains("open");

            faqItems.forEach(otherItem => {
                otherItem.classList.remove("open");

                const otherQuestion = otherItem.querySelector(".faq-question");
                const otherAnswer = otherItem.querySelector(".faq-answer");

                if (otherQuestion) {
                    otherQuestion.setAttribute("aria-expanded", "false");
                }

                if (otherAnswer) {
                    otherAnswer.style.maxHeight = null;
                }
            });

            if (!wasOpen) {
                item.classList.add("open");
                question.setAttribute("aria-expanded", "true");
                answer.style.maxHeight = `${answer.scrollHeight}px`;
            }
        });
    });

    /* ---------------------------------------------------------
       BACK TO TOP
    --------------------------------------------------------- */
    const backTop = document.querySelector(".back-top");

    if (backTop) {
        const updateBackTop = () => {
            backTop.classList.toggle("visible", window.scrollY > 500);
        };

        window.addEventListener("scroll", updateBackTop, { passive: true });
        updateBackTop();

        backTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* ---------------------------------------------------------
       CURRENT YEAR
    --------------------------------------------------------- */
    document.querySelectorAll(".current-year").forEach(element => {
        element.textContent = new Date().getFullYear();
    });

    /* ---------------------------------------------------------
       CONTACT FORM VALIDATION
       Front-end only — intentionally does not submit data.
    --------------------------------------------------------- */
    const enquiryForm = document.getElementById("enquiryForm");

    if (enquiryForm) {
        const fields = {
            fullName: {
                element: document.getElementById("fullName"),
                validate: value => value.trim().length >= 2,
                message: "Please enter your full name."
            },
            mobile: {
                element: document.getElementById("mobile"),
                validate: value => /^[+()\-\s\d]{10,18}$/.test(value.trim()),
                message: "Please enter a valid mobile number."
            },
            email: {
                element: document.getElementById("email"),
                validate: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
                message: "Please enter a valid email address."
            },
            service: {
                element: document.getElementById("service"),
                validate: value => value !== "",
                message: "Please select a service."
            },
            contactMethod: {
                element: document.getElementById("contactMethod"),
                validate: value => value !== "",
                message: "Please select a preferred contact method."
            },
            message: {
                element: document.getElementById("message"),
                validate: value => value.trim().length >= 10,
                message: "Please enter at least 10 characters."
            }
        };

        const clearFieldError = field => {
            const wrapper = field.element.closest(".form-field");

            if (!wrapper) return;

            wrapper.classList.remove("invalid");

            const error = wrapper.querySelector(".field-error");
            if (error) error.textContent = "";
        };

        const setFieldError = field => {
            const wrapper = field.element.closest(".form-field");

            if (!wrapper) return;

            wrapper.classList.add("invalid");

            const error = wrapper.querySelector(".field-error");
            if (error) error.textContent = field.message;
        };

        Object.values(fields).forEach(field => {
            if (!field.element) return;

            field.element.addEventListener("input", () => {
                if (field.validate(field.element.value)) {
                    clearFieldError(field);
                }
            });

            field.element.addEventListener("change", () => {
                if (field.validate(field.element.value)) {
                    clearFieldError(field);
                }
            });
        });

        enquiryForm.addEventListener("submit", event => {
            event.preventDefault();

            const status = enquiryForm.querySelector(".form-status");
            let isValid = true;
            let firstInvalid = null;

            Object.values(fields).forEach(field => {
                if (!field.element) return;

                if (!field.validate(field.element.value)) {
                    setFieldError(field);
                    isValid = false;

                    if (!firstInvalid) {
                        firstInvalid = field.element;
                    }
                } else {
                    clearFieldError(field);
                }
            });

            if (!isValid) {
                if (status) {
                    status.className = "form-status error";
                    status.textContent = "Please check the highlighted fields.";
                }

                firstInvalid?.focus();
                return;
            }

            if (status) {
                status.className = "form-status success";
                status.textContent = "Your enquiry has passed validation. This static website does not send form data; please use the phone or email above to contact S R TRADERS.";
            }

            enquiryForm.reset();

            Object.values(fields).forEach(field => {
                if (field.element) clearFieldError(field);
            });
        });
    }

    /* ---------------------------------------------------------
       CLOSE MENU WHEN RESIZING TO DESKTOP
    --------------------------------------------------------- */
    window.addEventListener("resize", () => {
        if (window.innerWidth > 800 && navMenu && menuToggle) {
            navMenu.classList.remove("open");
            menuToggle.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        }

        /* Recalculate an open FAQ answer after viewport changes. */
        document.querySelectorAll(".faq-item.open .faq-answer").forEach(answer => {
            answer.style.maxHeight = `${answer.scrollHeight}px`;
        });
    });
});
