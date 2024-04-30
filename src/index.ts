import { gsap } from 'gsap';

const init = (): void => {
    const dropdownWrap = document.querySelector<HTMLElement>("[data-attribute='dropdown-wrap']");
    const dropdownLinks = document.querySelectorAll<HTMLElement>("[data-attribute='dropdown-link']");
    const dropdownContents = document.querySelectorAll<HTMLElement>("[data-attribute='dropdown-content']");
    const dropdownBg = document.querySelector<HTMLElement>("[data-attribute='dropdown-bg']");

    if (!dropdownWrap || !dropdownBg) {
        console.error('Dropdown wrap or background not found!');
        return;
    }

    gsap.defaults({ duration: 0.4 });
    gsap.set(dropdownContents, { opacity: 0, y: -6 });
    gsap.set(dropdownWrap, { display: "none" });

    let isBackgroundVisible = false;  // Track the visibility of the dropdown background

    dropdownLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.stopPropagation();
            handleDropdownToggle(index);
        });
    });

    dropdownContents.forEach(content => {
        content.addEventListener('click', (e) => e.stopPropagation());
    });

    document.addEventListener('click', hideDropdown);

    function handleDropdownToggle(index: number): void {
        const currentContent = dropdownContents[index];
        const isActive = currentContent.classList.contains('active');

        if (!isActive && !isAnyContentActive() && !isBackgroundVisible) {
            displayDropdownBackground();
        }

        if (isActive) {
            hideDropdown();
        } else {
            switchContent(currentContent);
        }
    }

    function isAnyContentActive(): boolean {
        return Array.from(dropdownContents).some(content => content.classList.contains('active'));
    }

    function displayDropdownBackground(): void {
        dropdownWrap!.style.display = "flex";
        gsap.fromTo(dropdownBg, { height: '0rem', opacity: 0 }, { height: '42rem', opacity: 1, ease: "power3.out" });
        isBackgroundVisible = true;  // Mark the background as visible
    }

    function switchContent(newContent: HTMLElement): void {
        const activeContent = document.querySelector<HTMLElement>(".active");
        if (activeContent) {
            gsap.to(activeContent, { opacity: 0, y: -6, onComplete: () => activeContent.classList.remove('active') });
        }
        gsap.to(newContent, {
            opacity: 1, y: 0, delay: 0.3,
            onStart: () => {
                newContent.classList.add('active');
                newContent.style.pointerEvents = 'auto';
                newContent.style.zIndex = '1';
            }
        });
    }

    function hideDropdown(): void {
        console.log('Closing dropdowns and cleaning up.');
        gsap.to(dropdownContents, { opacity: 0, y: -6 });
        gsap.to(dropdownBg, { height: '0rem', opacity: 0, ease: "power3.out" });
        dropdownContents.forEach(content => {
            content.classList.remove('active');
            content.style.pointerEvents = 'none';
            content.style.zIndex = '0';
        });
        setTimeout(() => {
            dropdownWrap!.style.display = "none";
        }, 600);
        isBackgroundVisible = false;  // Reset background visibility state
    }
};

document.addEventListener("DOMContentLoaded", init);
