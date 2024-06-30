import React from 'react';
import { TopBarProps, Tools, Cursor } from '../util/types';
import { LuMousePointer } from 'react-icons/lu';
import { FaRegHandPaper } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { invertedShortCutMap } from '../util/config';

const iconMap = {
    [Tools.Pointer]: <LuMousePointer />,
    [Tools.Pan]: <FaRegHandPaper />,
};

const TopBar: React.FC<TopBarProps> = ({ tool, setTool, setCursor }) => {
    const onChange = (t: Tools): void => {
        setCursor(Cursor.Crosshair);
        if (t === Tools.Pointer) setCursor(Cursor.Default);
        if (t === Tools.Pan) setCursor(Cursor.Grab);
        setTool(t as Tools);
    };

    return (
        <div className="flex rounded-lg drop-shadow-[0px_0px_8px_rgba(0,0,0,0.15)] bg-white/70 backdrop-blur-sm absolute mt-4 px-1 cursor-default">
            {Object.values(Tools).map((t, id) => (
                <div
                    className={`m-1 p-3 rounded-lg cursor-pointer ${
                        tool === t ? 'bg-sky-200' : 'hover:bg-sky-100'
                    }`}
                    id={`tooltipId${id}`}
                    key={t}
                    onClick={() => {
                        onChange(t);
                    }}
                >
                    {iconMap[t]}
                    <Tooltip anchorSelect={`#tooltipId${id}`} place="bottom">
                        {`${t.charAt(0).toUpperCase() + t.slice(1)} (${invertedShortCutMap[t].toUpperCase()})`}
                    </Tooltip>
                </div>
            ))}
        </div>
    );
};

export default TopBar;
