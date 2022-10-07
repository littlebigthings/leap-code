class LEADFORMSUBMISSION {
    constructor($formElm) {
        this.$formElement = $formElm;
        this.$inputElement = this.$formElement.querySelector("[data-input='number']");
        this.$sendData = this.$formElement.querySelector("[data-input='add-number']")
        this.$infoFirst = this.$formElement.querySelector("[data-info='first']");
        this.$infoSecond = this.$formElement.querySelector("[data-info='second']");
        this.$successBlock = this.$formElement.querySelector(".success-msg");
        this.$errorBlock = this.$formElement.querySelector(".error-message");
        this.$btn = this.$formElement.querySelector("[data-btn='form']");
        this.inputPlugin = null;
        this.inputValue = null;
        this.isFormSubmitted = false;
        this.init();
    }

    init() {
        this.addPlugin();
        this.addListener();
    }

    addPlugin() {
        this.inputPlugin = window.intlTelInput(this.$inputElement, {
            initialCountry: "auto",
            separateDialCode: true,
            geoIpLookup: (success, failure) => {
                $.get("https://ipinfo.io", function () { }, "jsonp").always(function (resp) {
                    var countryCode = (resp && resp.country) ? resp.country : "us";
                    success(countryCode);
                });
            },
            preferredCountries: ["us",],
            excludeCountries: ["af", "br", "ga", "iq", "ly", "mv", "ma", "kp", "kr", "sa", "ae"],
        });

    }

    addListener() {
        this.showHideError();
        this.$inputElement.addEventListener('focus', (event) => {
            this.$inputElement.style.borderColor = "#006ACB";
            this.$inputElement.style.background = "rgba(255, 255, 255, 0.8)";
            let hasData = event.target.value;
            if (hasData.length > 0) {
                if (this.validateNumber()) {
                    this.showHideError(false, true, false)
                }
                else if (!this.validateNumber()) {
                    this.showHideError(false, false, true)
                }
            } else {
                this.showHideError(false, true, false)
            }
        }, true);

        this.$inputElement.addEventListener('blur', (event) => {
            this.$inputElement.style.borderColor = "transparent";
            this.$inputElement.style.background = "#ffffff";
            let hasData = event.target.value;
            if (hasData.length > 0) {
                if (this.validateNumber() && !this.isFormSubmitted) {
                    this.showHideError(false, true, false)
                }
                else if (!this.validateNumber()) {
                    this.showHideError(false, false, true)
                }
            } else {
                this.showHideError(false, true, false)
            }
        }, true);

        this.$formElement.addEventListener("submit", (event) => {
            if (this.validateNumber()) {
                this.isFormSubmitted = true;
                this.$sendData.value = this.inputValue;
                this.showHideError(false, false, false);
                this.showAllSuccessMsg();
            }
            else if (!this.validateNumber()) {
                this.isFormSubmitted = false;
                event.preventDefault();
                event.stopPropagation();
                this.$btn.value = "Try again."
                this.showHideError(false, false, true);
            }
        })

        this.$inputElement.addEventListener("open:countrydropdown", () => {
            this.$inputElement.style.borderColor = "#006ACB";
            this.$inputElement.style.background = "rgba(255, 255, 255, 0.8)";
        });

        this.$inputElement.addEventListener("close:countrydropdown", () => {
            this.$inputElement.style.borderColor = "transparent";
            this.$inputElement.style.background = "#ffffff";
        });
    }

    validateNumber() {
        let number = this.inputPlugin.getNumber(intlTelInputUtils.numberFormat.E164);
        if (number.length > 0 && this.inputPlugin.isValidNumber()) {
            this.inputValue = number.replace("+", "");
            return true;
        }
        return false;
    }

    showHideError(showFirst = true, showSecond = false, showError = false) {
        if (showError) this.$inputElement.style.borderColor = "#EE2B2B";
        showFirst ? this.$infoFirst.style.display = "block" : this.$infoFirst.style.display = "none";
        showSecond ? this.$infoSecond.style.display = "block" : this.$infoSecond.style.display = "none";
        showError ? this.$errorBlock.style.display = "block" : this.$errorBlock.style.display = "none";
    }

    showAllSuccessMsg() {
        // hide all info wraps
        this.allinfo = document.querySelectorAll(".info-wrap");
        if (this.allinfo.length > 0) {
            this.allinfo.forEach(wrap => {
                wrap.style.display = "none";
            })
        }
        // hide all the form wraps
        this.allForm = document.querySelectorAll(".form-wrp");
        if (this.allForm.length > 0) {
            this.allForm.forEach(wrap => {
                wrap.style.display = "none";
            })
        }
        // show success message on all the forms.
        this.allSuccessMessage = document.querySelectorAll(".success-msg");
        if (this.allSuccessMessage.length > 0) {
            this.allSuccessMessage.forEach(wrap => {
                wrap.style.display = "block";
            })
        }
        // hide all error wraps
        this.allError = document.querySelectorAll(".error-message");
        if (this.allError.length > 0) {
            this.allError.forEach(wrap => {
                wrap.style.display = "none";
            })
        }
    }

}
let formElm = document.querySelectorAll("[data-form='leadform']");
if (formElm != undefined && formElm.length > 0) {
    formElm.forEach(form => {
        new LEADFORMSUBMISSION(form);
    })
}