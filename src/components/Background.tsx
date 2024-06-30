//@ts-nocheck
import { backgroundColors, transparentBackgroundUrl } from '../util/config';
import {
    Popover,
    PopoverArrow,
    PopoverContent,
    PopoverTrigger,
} from './Popover';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/css';

const Background: React.FC = ({ backgroundColor, setBackgroundColor }) => {
    const [color, setColor] = useColor( backgroundColor);

    return (
        <div className="absolute mx-4 mt-4 px-2 py-3 rounded-lg drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm w-auto h-auto">
            <div className="text-base ml-1 mb-1 text-gray-700">Background</div>
            <div className="flex items-center">
                {backgroundColors.map((color, index) => {
                    return (
                        <button
                            key={index}
                            className="w-5 h-5 rounded-[4px] m-1"
                            style={{
                                backgroundColor: color,
                                backgroundImage:
                                    color === 'transparent'
                                        ? `url(${transparentBackgroundUrl})`
                                        : 'none',
                            }}
                            onClick={() => setBackgroundColor(color)}
                        />
                    );
                })}
                <div className="w-px h-7 mx-1 bg-gray-400 opacity-40" />
                <Popover>
                    <PopoverTrigger className="flex justify-center">
                        <div
                            className="w-6 h-6 rounded-[4px] mx-1"
                            style={{
                                backgroundColor: color.hex,
                                backgroundImage:
                                    color.hex === 'transparent'
                                        ? `url(${transparentBackgroundUrl})`
                                        : 'none',
                            }}
                        />
                    </PopoverTrigger>
                    <PopoverContent
                        align="start"
                        alignOffset={-20}
                        sideOffset={20}
                        side="right"
                    >
                        <ColorPicker
                            hideInput={true}
                            height={100}
                            color={color}
                            onChange={(color) => {
                                setColor(color);
                                setBackgroundColor(color.hex);
                            }}
                        />
                        <PopoverArrow width={20} height={10} fill="white" />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};

export default Background;
