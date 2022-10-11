class NAVIGATIONANI{
    constructor(){
        this.navigationMenu = document.querySelector("[data-item='navigation']");
        this.logoWrapper = (this.navigationMenu != undefined) && this.navigationMenu.querySelector("[data-item='logo-wrapper']");
        this.logoIcon = (this.navigationMenu != undefined) && this.navigationMenu.querySelector("[data-item='logo']");
        this.logoText = (this.navigationMenu != undefined) && this.navigationMenu.querySelector("[data-item='text']");
        this.navigationCta = (this.navigationMenu != undefined) && this.navigationMenu.querySelector("[data-item='cta']");
        this.ctaLink = (this.navigationCta != undefined) && this.navigationCta.getAttribute("href");
        this.sectionToTrigger = document.querySelector(".section.white-bg-sec");
        this.setWhite = "#FFFFFF";
        this.setBlue = "#0597FF";
        this.setBlack = "#222222";
        this.setDarkBlue = "#006ACB";
        this.timeLine = gsap.timeline({ease:"sine.inOut"})
        this.themeMetaElm = document.querySelector('meta[name="theme-color"]');
        this.onMobile = false;
        this.init();
    }

    init(){
        this.startListener();
        this.animate();
        this.addOrRemoveLink();
        this.checkResize();
    }


    // function listen to window scroll -> animate the navigation menu.
    startListener(){
        ScrollTrigger.create({
            trigger: this.sectionToTrigger,
            start: `-${window.getComputedStyle(this.navigationMenu).getPropertyValue("height")} top`,
            onEnter: self => {
                this.themeMetaElm.setAttribute("content",this.setWhite);
                this.timeLine.play()
            },
            onLeaveBack: self => {
                this.themeMetaElm.setAttribute("content",this.setBlue);
                this.timeLine.reverse()
            },
          });
    }

    animate(){
        this.timeLine.pause();
        this.timeLine.to([this.navigationMenu, this.logoWrapper], {
            backgroundColor:this.setWhite,
            duration:0,
        })
        this.timeLine.to([this.logoIcon, this.navigationCta], {
            color:this.setWhite,
            duration:0,
        })
        this.timeLine.to(this.navigationCta, {
            backgroundColor:this.setDarkBlue,
            duration:0,
        })
        this.timeLine.to(this.logoText, {
            color:this.setBlack,
            duration:0,
        })
        this.timeLine.to(this.logoWrapper,{
            backgroundColor:this.setBlue,
            duration:0,
        })
    }

    checkResize() {
        window.addEventListener("resize", () => {
            this.addOrRemoveLink();
        })
    }
    
    addOrRemoveLink(){
        if(window.screen.width<=768 && !this.onMobile){
            this.navigationCta.setAttribute("href", this.ctaLink);
            this.onMobile = true;
        }
        else if(window.screen.width >786 && this.onMobile){
            this.navigationCta.setAttribute("href", "#");
            this.onMobile = false;
        }
        else if(window.screen.width >786 && !this.onMobile){
            this.navigationCta.setAttribute("href", "#");
        }
    }
}

new NAVIGATIONANI();