import React from 'react';

type IconProps = { className?: string };

export const PencilSquareIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const GoogleGeminiIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fill="#4285F4" d="M14.9 12l-2.5-4.3L9.9 12l2.5 4.3 2.5-4.3z"/>
        <path fill="#34A853" d="M12 21.4c-5.2 0-9.4-4.2-9.4-9.4S6.8 2.6 12 2.6c2.5 0 4.8.9 6.6 2.5l-2.8 2.8C14.7 6.8 13.4 6.2 12 6.2c-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4c2.8 0 5-1.9 5.6-4.4h-5.6v-3.6h9.3c.1.5.2 1 .2 1.6 0 5.7-3.8 9.8-9.5 9.8z"/>
    </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.176.435c.58.117 1.007.636 1.11 1.215l.61 3.053a1.686 1.686 0 0 0 2.28 1.417l2.85-1.425a1.125 1.125 0 0 1 1.34.62l1.215 2.43a1.125 1.125 0 0 1-.62 1.34l-2.85 1.425a1.686 1.686 0 0 0-1.417 2.28l-.61 3.053c-.103.58-.63.998-1.215 1.11l-2.176.435c-.55.11-.952.56-1.007 1.11l-.436 2.176c-.117.58-.636 1.007-1.215 1.11l-3.053.61a1.686 1.686 0 0 0-1.417-2.28l-1.425-2.85a1.125 1.125 0 0 1 .62-1.34l2.43-1.215a1.125 1.125 0 0 1 1.34.62l1.425 2.85c.43.86.356 1.83-.21 2.55l-3.053-.61a1.686 1.686 0 0 0-2.28 1.417l-1.425 2.85a1.125 1.125 0 0 1-1.34-.62l-1.215-2.43a1.125 1.125 0 0 1 .62-1.34l2.85-1.425a1.686 1.686 0 0 0 1.417-2.28l.61-3.053c.103-.58.63-.998 1.215-1.11l2.176-.435c.55-.11.952-.56 1.007-1.11l.436-2.176Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.868 2.884c.321-.772.117-1.623-.454-2.131A1.5 1.5 0 0 0 8.35.636L6.72 2.122a1.5 1.5 0 0 0-.454 2.131l1.528 1.636a1.5 1.5 0 0 0 2.131.454l2.064-2.205c.002-.002.003-.004.004-.006Zm-5.83 5.89c.321.772.117 1.623-.454 2.131a1.5 1.5 0 0 0-1.079 1.45l-.001.08a1.5 1.5 0 0 0 1.56 1.559l1.696-.002a1.5 1.5 0 0 0 1.449-1.08l.001-.002c.772-.321 1.623-.117 2.131.454l1.636 1.528a1.5 1.5 0 0 0 2.131-.454l2.205-2.064a1.5 1.5 0 0 0 .454-2.131l-1.528-1.636a1.5 1.5 0 0 0-2.131-.454l-2.064 2.205c-.002.002-.003.004-.004.006Z" clipRule="evenodd" />
    </svg>
);

export const YoutubeIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M12.04,11.02l-1.6,1.01c-0.12,0.07-0.28-0.03-0.28-0.17v-2.04c0-0.14,0.16-0.24,0.28-0.17l1.6,1.01C12.16,10.74,12.16,10.94,12.04,11.02z M21.58,7.39c-0.23-0.84-0.89-1.5-1.73-1.73C18.25,5.25,12,5.25,12,5.25s-6.25,0-7.85,0.41c-0.84,0.23-1.5,0.89-1.73,1.73C2,9,2,12.01,2,12.01s0,3.01,0.42,4.61c0.23,0.84,0.89,1.5,1.73,1.73C5.75,18.76,12,18.76,12,18.76s6.25,0,7.85-0.41c0.84-0.23,1.5-0.89,1.73-1.73c0.42-1.6,0.42-4.61,0.42-4.61S22,9,21.58,7.39z"/></svg>;
export const ShortsIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M17.5,11.25l-6-3.75v7.5l6-3.75Zm-9,5.25h-3V7.5h3v9Zm-4.5,1.5h12v-12h-12v12Z"/></svg>;
export const ThreadsIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M13.52,10.39c-0.34-0.19-0.72-0.3-1.12-0.3-1.28,0-2.32,1.04-2.32,2.32s1.04,2.32,2.32,2.32c0.4,0,0.78-0.11,1.12-0.3v1.5c-0.36,0.16-0.76,0.24-1.19,0.24-2.11,0-3.82-1.71-3.82-3.82s1.71-3.82,3.82-3.82c0.43,0,0.83,0.08,1.19,0.24v1.5Zm-3.04,1.99c0-0.84,0.68-1.52,1.52-1.52s1.52,0.68,1.52,1.52-0.68,1.52-1.52,1.52-1.52-0.68-1.52-1.52Zm9.46-4.52c-0.32-0.18-0.66-0.3-1.02-0.36v1.65c0.23,0.06,0.45,0.16,0.64,0.28,0.78,0.48,1.2,1.38,1.2,2.34s-0.42,1.86-1.2,2.34c-0.19,0.12-0.41,0.22-0.64,0.28v1.65c0.36-0.06,0.7-0.18,1.02-0.36,1.44-0.82,2.32-2.31,2.32-3.91s-0.88-3.09-2.32-3.91Z"/></svg>;

export const EnIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <span className={className}>🇺🇸</span>;
export const JpIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <span className={className}>🇯🇵</span>;
export const EsIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => <span className={className}>🇪🇸</span>;

export const CopyIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const KeyIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5 0V6.375c0-.621.504-1.125 1.125-1.125h3.375M10.5 13.5 21 3" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.837a6.01 6.01 0 0 0 0-7.022a6.01 6.01 0 0 0-3 0 6.01 6.01 0 0 0 0 7.022A6.01 6.01 0 0 0 12 12.75Zm-4.5 6A2.25 2.25 0 0 1 5.25 21h13.5A2.25 2.25 0 0 1 16.5 18.75h-9Z" />
    </svg>
);