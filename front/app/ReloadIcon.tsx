import React from "react";

import { Svg, Path } from "react-native-svg";



interface ReloadIconProps {
    size?: number;
    color?: string;
}



export const MaleIcon: React.FC<ReloadIconProps> = ({ size = 20, color = "white" }) => {

    return (
        <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
            <Path
                fill={color}
                d="M442,48H352a22,22,0,0,0,0,44h36.89L328.5,152.39c-68.19-52.86-167-48-229.54,14.57h0C31.12,234.81,31.12,345.19,99,413A174.21,174.21,0,0,0,345,413c62.57-62.58,67.43-161.35,14.57-229.54L420,123.11V160a22,22,0,0,0,44,0V70A22,22,0,0,0,442,48ZM313.92,381.92a130.13,130.13,0,0,1-183.84,0c-50.69-50.68-50.69-133.16,0-183.84s133.16-50.69,183.84,0S364.61,331.24,313.92,381.92Z"
            />
        </Svg>
    );

};



export const FemaleIcon: React.FC<ReloadIconProps> = ({ size = 20, color = "white" }) => {

    return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <Path
                fill={color}
                d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5z" />
        </Svg>
    );

};