type colorScheme = 'light' | 'dark' | 'auto' | 'h4ck3r';
const colorSchemes = [
    'light', 'dark', 'auto', 'h4ck3r'
]

class StackColorScheme {
    private localStorageKey = 'StackColorScheme';
    private currentScheme: colorScheme;
    private systemPreferScheme: colorScheme;

    constructor(toggleEl: HTMLElement) {
        this.bindMatchMedia();
        this.currentScheme = this.getSavedScheme();

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);

        if (toggleEl)
            this.bindClick(toggleEl);

        if (document.body.style.transition == '')
            document.body.style.setProperty('transition', 'background-color .3s ease');
    }

    private saveScheme() {
        localStorage.setItem(this.localStorageKey, this.currentScheme);
    }

    private bindClick(toggleEl: HTMLElement) {
        toggleEl.addEventListener('click', (e) => {
            if (this.isDark()) {
                /// Disable dark mode
                this.currentScheme = 'light';
            }
            else {
                this.currentScheme = 'dark';
            }

            this.setBodyClass();

            if (this.currentScheme == this.systemPreferScheme) {
                /// Set to auto
                this.currentScheme = 'auto';
            }

            this.saveScheme();
        })
    }

    private isDark() {
        return (this.currentScheme == 'dark' || this.currentScheme == 'auto' && this.systemPreferScheme == 'dark');
    }

    private isH4ck3r() {
        return this.currentScheme == 'h4ck3r';
    }

    private dispatchEvent(colorScheme: colorScheme) {
        const event = new CustomEvent('onColorSchemeChange', {
            detail: colorScheme
        });
        window.dispatchEvent(event);
    }

    private setBodyClass() {
        if (this.isDark()) {
            document.documentElement.dataset.scheme = 'dark';
        }
        else if (this.isH4ck3r()) {
            document.documentElement.dataset.scheme = 'h4ck3r';
        }
        else {
            document.documentElement.dataset.scheme = 'light';
        }

        this.dispatchEvent(document.documentElement.dataset.scheme as colorScheme);
    }

    private getSavedScheme(): colorScheme {
        const savedScheme = localStorage.getItem(this.localStorageKey);
        if (colorSchemes.includes(savedScheme)) return savedScheme as colorScheme;
        else return 'auto';
    }

    private bindMatchMedia() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (e.matches) {
                this.systemPreferScheme = 'dark';
            }
            else {
                this.systemPreferScheme = 'light';
            }
            this.setBodyClass();
        });
    }
}

export default StackColorScheme;
