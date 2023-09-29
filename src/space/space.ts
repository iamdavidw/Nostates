
export function createSpace() {
    // MARK: Twinkling stars
    document.addEventListener('DOMContentLoaded', () => {
        for (let i = 0; i < 50; i++) {
        const star: HTMLDivElement = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        document.body.appendChild(star);
        }
    });
    


    
    // MARK: Shooting comets
    document.addEventListener('DOMContentLoaded', () => {
        const space: HTMLDivElement = document.createElement('div');
        space.className = 'space';
        let count: number = 0;
        addComet(0);

        // Function to add a comet with a customizable delay
        function addComet(delay: number): void {
            const comet: HTMLDivElement = document.createElement('div');
            setTimeout(() => {
                setTimeout(() => {
                    comet.className = 'comet';
                    comet.style.transform = `rotate(${Math.floor(Math.random() * (20 - (-20) + 1)) - 20}deg)`;
                    comet.style.marginLeft = `${Math.floor(Math.random() * (45 - (-45) + 1)) - 45}%`;
                    comet.style.opacity = `${Math.random() * 0.4}`;
                    space.appendChild(comet);
                    count = count + 1;
                    console.log(`Added comet, count ${count}`)
                    setTimeout(() => {
                        replaceComet(comet);
                    }, 9000);
                })
            }, delay);    
        }

        // Function to remove and replace comet
        function replaceComet(comet: HTMLDivElement): void {
            count = count - 1;
            console.log(`Removed comet, count ${count}`);
            space.removeChild(comet);
            // Adds a new comet with a random delay - 2/3 of the time it is 1 second long, but may be up to 4secs long
            addComet(Math.random() < 0.67 ? 1000 : Math.floor(Math.random() * 3 + 1) * 1000);
        }

        document.body.appendChild(space);
    });

}