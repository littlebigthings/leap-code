class LEADFORMSUBMISSION {
    constructor($formElm) {
        this.$formElement = $formElm;
        this.$inputElement = this.$formElement.querySelector("[data-input='number']");
        this.$infoFirst = this.$formElement.querySelector("[data-info='first']");
        this.$infoSecond = this.$formElement.querySelector("[data-info='second']");
        this.$successBlock = this.$formElement.querySelector(".success-msg");
        this.$errorBlock = this.$formElement.querySelector(".error-message");
        this.$btn = this.$formElement.querySelector("[data-btn='form']");
        this.inputPlugin = null;
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
        });

    }

    addListener() {
        this.showHideError();
        this.$inputElement.addEventListener('focus', (event) => {
            let hasData = event.target.value;
            if (hasData.length > 0) {
                if (this.validateNumber()) {
                    this.showHideError(false, true, false)
                }
                else if (!this.validateNumber()) {
                   this.showHideError(false, false, true)
                }
            }else{
                this.showHideError(false, true, false)
            }
        }, true);

        this.$inputElement.addEventListener('blur', (event) => {
            let hasData = event.target.value;
            if (hasData.length > 0) {
                if (this.validateNumber()) {
                    this.showHideError(false, true, false)
                }
                else if (!this.validateNumber()) {
                   this.showHideError(false, false, true)
                }
            }else{
                this.showHideError(true, false, false)
            }
        }, true);

        this.$formElement.addEventListener("submit", (event) => {
            if (this.validateNumber()) {
                this.showHideError(false, false, false);
            }
            else if (!this.validateNumber()) {
                event.preventDefault();
                event.stopPropagation();
                this.$btn.value = "Try again."
               this.showHideError(false, false, true);
            }
        })

    }

    validateNumber() {
        let number = this.inputPlugin.getNumber(intlTelInputUtils.numberFormat.E164);
        if (number.length > 0 && this.inputPlugin.isValidNumber()) {
            return true;
        }
        return false;
    }

    showHideError(showFirst=true, showSecond=false, showError=false){
        showFirst?this.$infoFirst.style.display = "block" : this.$infoFirst.style.display = "none" ;
        showSecond?this.$infoSecond.style.display = "block" : this.$infoSecond.style.display = "none";
        showError?this.$errorBlock.style.display = "block" : this.$errorBlock.style.display = "none";
    }

}
let formElm = document.querySelector("[data-form='leadform']");
if (formElm != undefined) new LEADFORMSUBMISSION(formElm);