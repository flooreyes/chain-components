//@ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { CoordinateInterface, Cursor, ChainsElement } from '../src/util/types';
import Menu from '../src/components/Menu';
import SearchBar from '../src/components/SearchBar';
import Background from '../src/components/Background';
import Modal from '../src/components/Modal';
import loadChains from '../src/util/loadChains';

const App = () => {
    const [chains, setChains] = useState<ChainsElement[]>([]);
    const [cursor, setCursor] = useState<Cursor>(Cursor.Default);
    const [backgroundColor, setBackgroundColor] = useState<string>('#d8d8d8');
    const [viewBox, setViewBox] = useState({
        x: 0,
        y: 0,
        w: 0,
        h: 0,
    });
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<string>('');
    const [modalImageUrl, setModalImageUrl] = useState<string>('');
    const [modalSvgCode, setModalSvgCode] = useState<string>('');
    const [svgBounds, setSvgBounds] = useState({
        minX: 0,
        minY: 0,
        width: 0,
        height: 0,
    });
    const svgRef = useRef<SVGSVGElement | null>(null);
    const minimapRef = useRef<HTMLCanvasElement | null>(null);
    const redBoxRef = useRef<HTMLDivElement | null>(null);

    const isDragging = useRef<boolean>(false);
    const [startPoint, setStartPoint] = useState<CoordinateInterface>({
        x: 0,
        y: 0,
    });
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const clickStartTime = useRef<number | null>(null);
    const clickThreshold = 200; // Threshold in milliseconds to distinguish between click and drag

    const size = 0.5; // Scale factor for the size of each chain
    const margin = 250; // Margin around the content
    const minimapScale = 0.08; // Scale factor for minimap
    const dampingFactor = 0.7; // Damping factor for slower panning
    const velocityFactor = 0.005; // Factor to control panning speed

    const [isIdle, setIsIdle] = useState<boolean>(true);
    const [isOverCanvas, setIsOverCanvas] = useState<boolean>(false);

    const hexWidth = 456 * size;
    const hexHeight = 526 * size;
    const spacing = 30;

    useEffect(() => {
        const load = async () => {
            const loadedChains = await loadChains();
            const totalChains = loadedChains.length;
            const aspectRatio = 4 / 3; // Landscape aspect ratio

            // Calculate the best even number of columns based on the aspect ratio
            let bestColumns = Math.max(
                2,
                Math.floor(Math.sqrt(totalChains * aspectRatio / 2) * 2)
            );
            // Ensure bestColumns is even
            if (bestColumns % 2 !== 0) {
                bestColumns += 1;
            }

            const columnsPerRow = bestColumns;

            // Calculate number of rows and columns
            const numberOfRows = Math.ceil(totalChains / columnsPerRow);
            const totalElements = numberOfRows * columnsPerRow;

            // Add placeholder elements to ensure even number of elements per row
            const paddedChains = [...loadedChains];
            while (paddedChains.length < totalElements) {
                paddedChains.push({
                    id: `placeholder-${paddedChains.length}`,
                    shape: '',
                    startPoint: { x: 0, y: 0 },
                    endPoint: { x: 0, y: 0 },
                });
            }

            const positionedChains = paddedChains.map((chain, index) => {
                const row = Math.floor(index / columnsPerRow);
                const col = index % columnsPerRow;

                const xOffset =
                    col * (hexWidth + spacing) +
                    (row % 2 === 0 ? 0 : hexWidth / 2 + spacing / 2);
                const yOffset = row * (hexHeight * 0.75 + spacing);

                return {
                    ...chain,
                    startPoint: { x: xOffset, y: yOffset },
                    endPoint: { x: xOffset + hexWidth, y: yOffset + hexHeight },
                };
            });

            setChains(positionedChains);
            calculateSvgBounds(positionedChains);
        };

        load();

        // Set initial viewBox dimensions
        if (typeof window !== 'undefined') {
            setViewBox({
                x: 0,
                y: 0,
                w: window.innerWidth,
                h: window.innerHeight,
            });
        }

    }, []);

    const calculateSvgBounds = (chains: ChainsElement[]) => {
        const minX =
            Math.min(...chains.map((chain) => chain.startPoint.x)) - margin;
        const minY =
            Math.min(...chains.map((chain) => chain.startPoint.y)) - margin;
        const maxX =
            Math.max(...chains.map((chain) => chain.endPoint.x)) + margin;
        const maxY =
            Math.max(...chains.map((chain) => chain.endPoint.y)) + margin;

        setSvgBounds({
            minX,
            minY,
            width: maxX - minX,
            height: maxY - minY,
        });

        if (typeof window !== 'undefined') {
            setViewBox({
                x: (minX + maxX - window.innerWidth) / 2,
                y: (minY + maxY - window.innerHeight) / 2,
                w: window.innerWidth,
                h: window.innerHeight,
            });

            // Trigger resize event after initial calculation
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        }
    };

    const getInverseGrayscale = (color: string) => {
        // Convert color to RGB
        const hex = color.replace('#', '');
        const rgb = hex.length === 6
            ? [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
            : [0, 0, 0];

        // Calculate the grayscale value
        const grayscale = Math.round((rgb[0] + rgb[1] + rgb[2]) / 3);

        // Calculate the inverse grayscale value
        const inverseGrayscale = 255 - grayscale;

        // Return the color as a CSS RGB string
        return `rgb(${inverseGrayscale}, ${inverseGrayscale}, ${inverseGrayscale})`;
    };

    useEffect(() => {
        if (!svgRef.current) return;

        const inverseShadowColor = getInverseGrayscale(backgroundColor);

        svgRef.current.innerHTML = '';

        chains.forEach((child, index) => {
            if (!child.shape) return; // Skip placeholder elements

            const svgElement = new DOMParser().parseFromString(
                child.shape,
                'image/svg+xml'
            ).documentElement;
            const scale = hoveredIndex === index ? 1.1 : 1;

            svgElement.setAttribute(
                'x',
                (child.startPoint.x - (456 * size * (scale - 1)) / 2).toString()
            );
            svgElement.setAttribute(
                'y',
                (child.startPoint.y - (526 * size * (scale - 1)) / 2).toString()
            );
            svgElement.setAttribute('width', (456 * size * scale).toString());
            svgElement.setAttribute('height', (526 * size * scale).toString());
            svgElement.setAttribute('transform', `scale(${size * scale})`);
            svgElement.setAttribute(
                'style',
                `transition: transform 200ms ease-in-out; transform-origin: center center; filter: drop-shadow(0px 3px 7px ${inverseShadowColor});`
            );

            svgElement.addEventListener('mouseenter', () =>
                setHoveredIndex(index)
            );
            svgElement.addEventListener('mouseleave', () =>
                setHoveredIndex(null)
            );
            svgElement.addEventListener('mousedown', () => {
                clickStartTime.current = performance.now();
            });
            svgElement.addEventListener('mouseup', async () => {
                const clickDuration = performance.now() - clickStartTime.current!;
                if (clickDuration < clickThreshold) {
                    setModalContent(child.id);
                    setModalImageUrl(`/chains/${child.id}.svg`);
                    const response = await fetch(`/chains/${child.id}.svg`);
                    const text = await response.text();
                    setModalSvgCode(text);
                    setModalOpen(true);
                }
            });

            if (svgElement) {
                svgRef.current?.appendChild(svgElement);
            }
        });
    }, [chains, hoveredIndex, backgroundColor]);

    useEffect(() => {
        const handleResize = () => {
            if (!svgRef.current) return;
            svgRef.current.setAttribute(
                'height',
                window.innerHeight.toString()
            );
            svgRef.current.setAttribute('width', window.innerWidth.toString());
            setViewBox((prevViewBox) => ({
                ...prevViewBox,
                w: window.innerWidth,
                h: window.innerHeight,
            }));
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleMouseDown = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        isDragging.current = true;
        setStartPoint({ x: e.clientX, y: e.clientY });
        clickStartTime.current = performance.now();
        setIsIdle(false); // Stop automatic panning when the user interacts
    };

    const handleMouseMove = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>
    ) => {
        if (!isDragging.current) return;

        setCursor(Cursor.Grabbing);
        const dx = (e.clientX - startPoint.x) * dampingFactor;
        const dy = (e.clientY - startPoint.y) * dampingFactor;

        setViewBox((prevViewBox) => {
            const newX = Math.max(
                Math.min(
                    prevViewBox.x - dx,
                    svgBounds.minX + svgBounds.width - prevViewBox.w
                ),
                svgBounds.minX
            );
            const newY = Math.max(
                Math.min(
                    prevViewBox.y - dy,
                    svgBounds.minY + svgBounds.height - prevViewBox.h
                ),
                svgBounds.minY
            );

            return {
                ...prevViewBox,
                x: newX,
                y: newY,
            };
        });

        setStartPoint({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        setCursor(Cursor.Grab);
    };

    const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const smoothPan = (
        start: { x: number; y: number },
        end: { x: number; y: number },
        duration: number
    ) => {
        const startTime = performance.now();

        const panStep = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            const newX = start.x + (end.x - start.x) * easedProgress;
            const newY = start.y + (end.y - start.y) * easedProgress;

            setViewBox((prev) => ({
                ...prev,
                x: newX,
                y: newY,
            }));

            if (progress < 1) {
                requestAnimationFrame(panStep);
            }
        };

        requestAnimationFrame(panStep);
    };

    const handleSearch = (id: string) => {
        const chain = chains.find((d) =>
            d.id.toLowerCase().includes(id.toLowerCase())
        );
        if (chain) {
            const targetX =
                chain.startPoint.x -
                viewBox.w / 2 +
                (chain.endPoint.x - chain.startPoint.x) / 2;
            const targetY =
                chain.startPoint.y -
                viewBox.h / 2 +
                (chain.endPoint.y - chain.startPoint.y) / 2;
            smoothPan(
                { x: viewBox.x, y: viewBox.y },
                { x: targetX, y: targetY },
                300
            );
        }
    };

    const renderMinimap = () => {
        if (!minimapRef.current || !svgRef.current) return;
        const context = minimapRef.current.getContext('2d');
        if (!context) return;

        const canvasWidth = svgBounds.width * minimapScale;
        const canvasHeight = svgBounds.height * minimapScale;

        minimapRef.current.width = canvasWidth;
        minimapRef.current.height = canvasHeight;

        const centerX = (canvasWidth - svgBounds.width * minimapScale) / 2;
        const centerY = (canvasHeight - svgBounds.height * minimapScale) / 2;

        context.clearRect(0, 0, canvasWidth, canvasHeight);

        chains.forEach((chain) => {
            if (!chain.shape) return; // Skip placeholder elements

            const img = new Image();
            img.src = `data:image/svg+xml;base64,${btoa(chain.shape)}`;
            img.onload = () => {
                context.drawImage(
                    img,
                    (chain.startPoint.x - svgBounds.minX) * minimapScale +
                        centerX,
                    (chain.startPoint.y - svgBounds.minY) * minimapScale +
                        centerY,
                    (chain.endPoint.x - chain.startPoint.x) * minimapScale,
                    (chain.endPoint.y - chain.startPoint.y) * minimapScale
                );
            };
        });
    };

    const updateRedBox = () => {
        if (!redBoxRef.current || !minimapRef.current) return;

        const centerX =
            (minimapRef.current.width - svgBounds.width * minimapScale) / 2;
        const centerY =
            (minimapRef.current.height - svgBounds.height * minimapScale) / 2;

        redBoxRef.current.style.left = `${
            (viewBox.x - svgBounds.minX) * minimapScale + centerX
        }px`;
        redBoxRef.current.style.top = `${
            (viewBox.y - svgBounds.minY) * minimapScale + centerY
        }px`;
        redBoxRef.current.style.width = `${viewBox.w * minimapScale}px`;
        redBoxRef.current.style.height = `${viewBox.h * minimapScale}px`;
    };

    useEffect(() => {
        renderMinimap();
    }, [chains, svgBounds]);

    useEffect(() => {
        updateRedBox();
    }, [viewBox]);

    useEffect(() => {
        console.log('Minimap:', minimapRef.current);
        console.log('Red Box:', redBoxRef.current);
    }, []);

    const handleViewportPan = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (modalOpen || !isOverCanvas) return; // Do not pan with mouse movement if the modal is open or not over canvas
        setIsIdle(false); // Stop automatic panning when the user interacts
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const deltaX = (clientX - centerX) * velocityFactor;
        const deltaY = (clientY - centerY) * velocityFactor;

        setViewBox((prevViewBox) => {
            const newX = Math.max(
                Math.min(
                    prevViewBox.x + deltaX,
                    svgBounds.minX + svgBounds.width - prevViewBox.w
                ),
                svgBounds.minX
            );
            const newY = Math.max(
                Math.min(
                    prevViewBox.y + deltaY,
                    svgBounds.minY + svgBounds.height - prevViewBox.h
                ),
                svgBounds.minY
            );

            return {
                ...prevViewBox,
                x: newX,
                y: newY,
            };
        });
    };

    useEffect(() => {
        let animationFrameId: number;
        const autoPan = () => {
            setViewBox((prevViewBox) => {
                const angle = (performance.now() / 2000) % (2 * Math.PI); // Slow circular motion
                const deltaX = Math.cos(angle) * velocityFactor * 40;
                const deltaY = Math.sin(angle) * velocityFactor * 20;

                const newX = Math.max(
                    Math.min(
                        prevViewBox.x + deltaX,
                        svgBounds.minX + svgBounds.width - prevViewBox.w
                    ),
                    svgBounds.minX
                );
                const newY = Math.max(
                    Math.min(
                        prevViewBox.y + deltaY,
                        svgBounds.minY + svgBounds.height - prevViewBox.h
                    ),
                    svgBounds.minY
                );

                return {
                    ...prevViewBox,
                    x: newX,
                    y: newY,
                };
            });

            animationFrameId = requestAnimationFrame(autoPan);
        };

        if (isIdle || modalOpen || !isOverCanvas) { // Auto pan when idle, modal is open, or not over canvas
            animationFrameId = requestAnimationFrame(autoPan);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isIdle, modalOpen, isOverCanvas, svgBounds]);

    return (
        <div className="relative fade-in">
            <Background
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                onMouseEnter={() => setIsOverCanvas(false)}
                onMouseLeave={() => setIsOverCanvas(true)}
            />
            <SearchBar onSearch={handleSearch} 
                onMouseEnter={() => setIsOverCanvas(false)}
                onMouseLeave={() => setIsOverCanvas(true)}
            />
            <Menu 
                onMouseEnter={() => setIsOverCanvas(false)}
                onMouseLeave={() => setIsOverCanvas(true)}
            />
            <div className="flex flex-col items-center" 
                onMouseMove={handleViewportPan} 
                onMouseEnter={() => setIsOverCanvas(true)} 
                onMouseLeave={() => setIsOverCanvas(false)}
            >
                <svg
                    id="canvas"
                    className="overflow-hidden"
                    style={{
                        cursor,
                        backgroundImage:
                            'linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 2px), linear-gradient(rgba(0,0,0,0.1) 1px, transparent 2px)',
                        backgroundSize:
                            '100px 100px, 100px 100px, 20px 20px, 20px 20px',
                        backgroundColor: backgroundColor,
                    }}
                    ref={svgRef}
                    width={svgBounds.width}
                    height={svgBounds.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
                />
            </div>
            {/* <div
                className="fixed bottom-3 right-4 bg-white/50 backdrop-blur-sm z-[2000] rounded-xl -translate-x-72 "
                style={{
                    width: `${svgBounds.width * minimapScale}px`,
                    height: `${svgBounds.height * minimapScale}px`,
                }}
            >
                <canvas
                    ref={minimapRef}
                    className="absolute top-0 left-0 opacity-70 -translate-x-72"
                    width={svgBounds.width * minimapScale}
                    height={svgBounds.height * minimapScale}
                />
                <div
                    ref={redBoxRef}
                    className="absolute border border-red-500 z-[3000] rounded-lg -translate-x-72"
                    style={{
                        boxSizing: 'border-box',
                    }}
                />
            </div> */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                content={modalContent}
                imageUrl={modalImageUrl}
                svgCode={modalSvgCode}
            />
        </div>
    );
};

export default App;
