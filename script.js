// MODERN JAVASCRIPT FOR PORTFOLIO INTERACTIVITY

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Typing Effect
    const typedTextSpan = document.querySelector(".typed-text");
    const textArray = ["build interactive web experiences.", "study Computer Science Engineering.", "love writing Python code.", "innovate with technology."];
    let textArrayIndex = 0; let charIndex = 0;
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++; setTimeout(type, 100);
        } else { setTimeout(erase, 2000); }
    }
    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--; setTimeout(erase, 50);
        } else {
            textArrayIndex = (textArrayIndex + 1) % textArray.length;
            setTimeout(type, 1100);
        }
    }
    if(typedTextSpan) setTimeout(type, 200);

    // 2. Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.hidden').forEach(el => observer.observe(el));

    // 3. LogoLoop Logic
    class LogoLoop {
        constructor(selector, logos, opts = {}) {
            this.container = document.querySelector(selector);
            if (!this.container) return;
            this.logos = logos; this.speed = opts.speed || 120;
            this.isHovered = false; this.init();
        }
        init() {
            this.track = document.createElement('div');
            this.track.className = 'logoloop__track';
            this.container.appendChild(this.track);
            const list = document.createElement('ul'); list.className = 'logoloop__list';
            this.logos.forEach(l => {
                const li = document.createElement('li'); li.className = 'logoloop__item';
                li.innerHTML = `<i class="${l.icon}" style="color:${l.color}"></i><span>${l.title}</span>`;
                list.appendChild(li);
            });
            for(let i=0; i<3; i++) this.track.appendChild(list.cloneNode(true));
            this.offset = 0; this.lastTime = null;
            this.container.onmouseenter = () => this.isHovered = true;
            this.container.onmouseleave = () => this.isHovered = false;
            requestAnimationFrame(this.animate.bind(this));
        }
        animate(t) {
            if (!this.lastTime) this.lastTime = t;
            const dt = (t - this.lastTime) / 1000; this.lastTime = t;
            if (!this.isHovered) this.offset += this.speed * dt;
            const lw = this.track.scrollWidth / 3;
            if (this.offset >= lw) this.offset = 0;
            this.track.style.transform = `translateX(${-this.offset}px)`;
            requestAnimationFrame(this.animate.bind(this));
        }
    }

    const techLogos = [
        { icon: 'fab fa-js', title: 'JavaScript', color: '#F7DF1E' },
        { icon: 'fas fa-database', title: 'MySQL', color: '#00758F' },
        { icon: 'fab fa-react', title: 'React', color: '#61DAFB' },
        { icon: 'fab fa-bootstrap', title: 'Bootstrap', color: '#7952B3' },
        { icon: 'fas fa-brain', title: 'TensorFlow', color: '#FF6F00' },
        { icon: 'fas fa-dna', title: 'Scikit-learn', color: '#F7931E' },
        { icon: 'fas fa-table', title: 'Pandas', color: '#150458' },
        { icon: 'fab fa-python', title: 'Python', color: '#3776AB' },
        { icon: 'fab fa-node-js', title: 'Node.js', color: '#339933' }
    ];
    if (document.querySelector('#tech-loop')) new LogoLoop('#tech-loop', techLogos);

    // 4. ChromaGrid Port
    class ChromaGrid {
        constructor(selector, items, options = {}) {
            this.root = document.querySelector(selector);
            if (!this.root) return;
            this.items = items;
            this.radius = options.radius || 300;
            this.damping = options.damping || 0.45;
            this.fadeOut = options.fadeOut || 0.6;
            this.ease = options.ease || 'power3.out';
            this.pos = { x: 0, y: 0 };
            this.init();
        }
        init() {
            this.grid = document.createElement('div');
            this.grid.className = 'chroma-grid';
            this.grid.style.setProperty('--r', `${this.radius}px`);
            this.root.appendChild(this.grid);
            this.items.forEach(item => {
                const card = document.createElement('article');
                card.className = 'chroma-card';
                card.style.setProperty('--card-border', item.borderColor || '#00f5ff');
                card.style.setProperty('--card-gradient', item.gradient || 'linear-gradient(145deg, #1a1a1a, #000)');
                card.innerHTML = `
                    <div class="chroma-img-wrapper">
                        <img src="${item.image}" alt="${item.title}">
                        <div class="chroma-links">
                            ${item.github ? `<a href="${item.github}" target="_blank" class="chroma-link-btn" title="View Code"><i class="fab fa-github"></i></a>` : ''}
                            ${item.live ? `<a href="${item.live}" target="_blank" class="chroma-link-btn" title="Live Demo"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                    </div>
                    <footer class="chroma-info">
                        <h3 class="name">${item.title}</h3>
                        ${item.subtitle ? `<p class="role">${item.subtitle}</p>` : ''}
                    </footer>
                `;
                card.onmousemove = (e) => {
                    const r = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
                    card.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
                };
                this.grid.appendChild(card);
            });
            this.overlay = document.createElement('div'); this.overlay.className = 'chroma-overlay'; this.grid.appendChild(this.overlay);
            this.fade = document.createElement('div'); this.fade.className = 'chroma-fade'; this.grid.appendChild(this.fade);
            this.setX = gsap.quickSetter(this.grid, '--x', 'px'); this.setY = gsap.quickSetter(this.grid, '--y', 'px');
            this.grid.onpointermove = (e) => {
                const r = this.grid.getBoundingClientRect();
                this.moveTo(e.clientX - r.left, e.clientY - r.top);
                gsap.to(this.fade, { opacity: 0, duration: 0.25, overwrite: true });
            };
            this.grid.onpointerleave = () => gsap.to(this.fade, { opacity: 0, duration: this.fadeOut, overwrite: true });
        }
        moveTo(x, y) {
            gsap.to(this.pos, { x, y, duration: this.damping, ease: this.ease, onUpdate: () => { this.setX(this.pos.x); this.setY(this.pos.y); }, overwrite: true });
        }
    }

    const projectData = [
        { image: 'resume-parser.png', title: 'Resume Analyzer', subtitle: 'AI • ATS Scoring', github: 'https://github.com/SriNithyaCodes', live: 'https://resume-analyzer-parser.vercel.app/', borderColor: '#F59E0B', gradient: 'linear-gradient(145deg, #F59E0B22, #000)' },
        { image: 'translator-app.png', title: 'Linguist AI', subtitle: 'Vanilla JS • API', github: 'https://github.com/SriNithyaCodes/TranslatorApp', live: 'https://translatorlanguageapp.vercel.app/', borderColor: '#8B5CF6', gradient: 'linear-gradient(145deg, #8B5CF622, #000)' },
        { image: 'Calculator.jpg', title: 'Smart Calculator', subtitle: 'Modern UI • Logic', github: 'https://github.com/SriNithyaCodes/Calculator', live: 'https://niniyya.github.io/Calculator/', borderColor: '#10B981', gradient: 'linear-gradient(145deg, #10B98122, #000)' },
        { image: 'myfood.jpg', title: 'Landing Page', subtitle: 'HTML5 • CSS3 • UI', github: 'https://github.com/SriNithyaCodes/LandingPage', live: '#', borderColor: '#EC4899', gradient: 'linear-gradient(145deg, #EC489922, #000)' }
    ];
    if (document.querySelector('#chroma-projects')) new ChromaGrid('#chroma-projects', projectData);

    const aboutData = [{ image: 'profile.jpg', title: 'K. Sri Nithya', borderColor: '#00f5ff', gradient: 'linear-gradient(145deg, #00f5ff11, #000)', url: '#' }];
    if (document.querySelector('#about-chroma')) new ChromaGrid('#about-chroma', aboutData, { radius: 300 });

    // 5. Interactive Eyes
    document.addEventListener('mousemove', (e) => {
        const eyes = document.querySelectorAll('.eye');
        const container = document.querySelector('.eyes-container');
        if (container) {
            const r = container.getBoundingClientRect();
            const tX = (e.clientX - (r.left + r.width / 2)) / 30;
            const tY = (e.clientY - (r.top + r.height / 2)) / 30;
            container.style.transform = `perspective(1000px) rotateX(${-tY}deg) rotateY(${tX}deg)`;
        }
        eyes.forEach(eye => {
            const iris = eye.querySelector('.iris'); const pupil = eye.querySelector('.pupil'); const r = eye.getBoundingClientRect();
            const eX = r.left + r.width / 2; const eY = r.top + r.height / 2;
            const angle = Math.atan2(e.clientY - eY, e.clientX - eX);
            const dist = Math.min(r.width / 4, Math.hypot(e.clientX - eX, e.clientY - eY) / 15);
            if (iris) iris.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`;
            if (pupil) pupil.style.transform = `translate(${Math.cos(angle) * dist * 1.4}px, ${Math.sin(angle) * dist * 1.4}px)`;
        });
    });

    // 6. LightRays Port (WebGL)
    class LightRays {
        constructor(selector, options = {}) {
            this.container = document.querySelector(selector);
            if (!this.container || !window.OGL) return;
            this.options = {
                raysOrigin: 'top-center', raysColor: options.raysColor || '#00ffff', raysSpeed: 1.5, lightSpread: 0.8, rayLength: 1.2,
                pulsating: false, fadeDistance: 1.0, saturation: 1.0, followMouse: true, mouseInfluence: 0.1, noiseAmount: 0.1, distortion: 0.05, ...options
            };
            this.mouse = { x: 0.5, y: 0.5 }; this.smoothMouse = { x: 0.5, y: 0.5 };
            this.init();
        }
        hexToRgb(hex) {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
        }
        getAnchorAndDir(origin, w, h) {
            const outside = 0.2;
            switch (origin) {
                case 'top-left': return { anchor: [0, -outside * h], dir: [0, 1] };
                case 'top-right': return { anchor: [w, -outside * h], dir: [0, 1] };
                case 'left': return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
                case 'right': return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
                case 'bottom-left': return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
                case 'bottom-center': return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
                case 'bottom-right': return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
                default: return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
            }
        }
        init() {
            const { Renderer, Program, Triangle, Mesh } = window.OGL;
            this.renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: true });
            this.gl = this.renderer.gl;
            this.container.appendChild(this.gl.canvas);
            const vert = `attribute vec2 position;varying vec2 vUv;void main(){vUv=position*0.5+0.5;gl_Position=vec4(position,0.0,1.0);}`;
            const frag = `precision highp float;uniform float iTime;uniform vec2 iResolution;uniform vec2 rayPos;uniform vec2 rayDir;uniform vec3 raysColor;uniform float raysSpeed;uniform float lightSpread;uniform float rayLength;uniform float pulsating;uniform float fadeDistance;uniform float saturation;uniform vec2 mousePos;uniform float mouseInfluence;uniform float noiseAmount;uniform float distortion;varying vec2 vUv;
            float noise(vec2 st){return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
            float rayStrength(vec2 raySource,vec2 rayRefDirection,vec2 coord,float seedA,float seedB,float speed){
                vec2 sc=coord-raySource;vec2 dn=normalize(sc);float cosA=dot(dn,rayRefDirection);
                float dA=cosA+distortion*sin(iTime*2.0+length(sc)*0.01)*0.2;
                float spF=pow(max(dA,0.0),1.0/max(lightSpread,0.001));
                float dist=length(sc);float mDist=iResolution.x*rayLength;
                float lF=clamp((mDist-dist)/mDist,0.0,1.0);float fF=clamp((iResolution.x*fadeDistance-dist)/(iResolution.x*fadeDistance),0.5,1.0);
                float pulse=pulsating>0.5?(0.8+0.2*sin(iTime*speed*3.0)):1.0;
                float bS=clamp((0.45+0.15*sin(dA*seedA+iTime*speed))+(0.3+0.2*cos(-dA*seedB+iTime*speed)),0.0,1.0);
                return bS*lF*fF*spF*pulse;
            }
            void main(){
                vec2 coord=vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y);vec2 fRD=rayDir;
                if(mouseInfluence>0.0){vec2 mS=mousePos*iResolution.xy;vec2 mD=normalize(mS-rayPos);fRD=normalize(mix(rayDir,mD,mouseInfluence));}
                vec4 r1=vec4(1.0)*rayStrength(rayPos,fRD,coord,36.2214,21.11349,1.5*raysSpeed);
                vec4 r2=vec4(1.0)*rayStrength(rayPos,fRD,coord,22.3991,18.0234,1.1*raysSpeed);
                vec4 fC=r1*0.5+r2*0.4;
                if(noiseAmount>0.0){float n=noise(coord*0.01+iTime*0.1);fC.rgb*=(1.0-noiseAmount+noiseAmount*n);}
                float br=1.0-(coord.y/iResolution.y);fC.x*=0.1+br*0.8;fC.y*=0.3+br*0.6;fC.z*=0.5+br*0.5;
                if(saturation!=1.0){float gray=dot(fC.rgb,vec3(0.299,0.587,0.114));fC.rgb=mix(vec3(gray),fC.rgb,saturation);}
                gl_FragColor=fC*vec4(raysColor,1.0);
            }`;
            this.uniforms = {
                iTime: { value: 0 }, iResolution: { value: [1, 1] }, rayPos: { value: [0, 0] }, rayDir: { value: [0, 1] },
                raysColor: { value: this.hexToRgb(this.options.raysColor) }, raysSpeed: { value: this.options.raysSpeed },
                lightSpread: { value: this.options.lightSpread }, rayLength: { value: this.options.rayLength },
                pulsating: { value: this.options.pulsating ? 1.0 : 0.0 }, fadeDistance: { value: this.options.fadeDistance },
                saturation: { value: this.options.saturation }, mousePos: { value: [0.5, 0.5] },
                mouseInfluence: { value: this.options.mouseInfluence }, noiseAmount: { value: this.options.noiseAmount },
                distortion: { value: this.options.distortion }
            };
            const geometry = new Triangle(this.gl);
            const program = new Program(this.gl, { vertex: vert, fragment: frag, uniforms: this.uniforms });
            this.mesh = new Mesh(this.gl, { geometry, program });
            this.updateSize();
            window.addEventListener('resize', () => this.updateSize());
            if (this.options.followMouse) {
                window.addEventListener('mousemove', (e) => {
                    const r = this.container.getBoundingClientRect();
                    this.mouse.x = (e.clientX - r.left) / r.width;
                    this.mouse.y = (e.clientY - r.top) / r.height;
                });
            }
            const loop = (t) => {
                this.uniforms.iTime.value = t * 0.001;
                if (this.options.followMouse) {
                    this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * 0.08;
                    this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * 0.08;
                    this.uniforms.mousePos.value = [this.smoothMouse.x, this.smoothMouse.y];
                }
                this.renderer.render({ scene: this.mesh });
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        }
        updateSize() {
            const w = this.container.clientWidth; const h = this.container.clientHeight;
            this.renderer.setSize(w, h);
            this.uniforms.iResolution.value = [w * this.renderer.dpr, h * this.renderer.dpr];
            const { anchor, dir } = this.getAnchorAndDir(this.options.raysOrigin, w * this.renderer.dpr, h * this.renderer.dpr);
            this.uniforms.rayPos.value = anchor; this.uniforms.rayDir.value = dir;
        }
    }

    // Initialize Hero LightRays
    setTimeout(() => {
        if (document.querySelector('#hero-light-rays')) {
            new LightRays('#hero-light-rays', { raysColor: '#00f5ff', raysSpeed: 0.6, lightSpread: 0.8, rayLength: 1.5 });
        }
    }, 200);
});
