import React from 'react';

// Extends with HTMLAttributes to allow passing standard props like `title`
export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string; // This specific prop is for the SVG element's class
}

const ICONS: Record<string, React.ReactNode> = {
  spinner: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
  text: <><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18.1H3" /></>,
  image: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
  file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" /></>,
  upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  bot: <><path d="M12 8V4H8" /><rect x="4" y="12" width="16" height="8" rx="2" /><path d="M2 12h20" /></>,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  summary: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
  quiz: <><path d="m9 12 2 2 4-4" /><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
  mindmap: <><path d="M12 3v2" /><path d="M12 19v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m4.93 19.07 1.41-1.41" /><path d="m17.66 6.34 1.41-1.41" /><circle cx="12" cy="12" r="4" /></>,
  code: <><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></>,
  close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  back: <polyline points="15 18 9 12 15 6" />,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
  brain: <><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h.38a2 2 0 0 1 1.95 1.54 2.5 2.5 0 0 1 .52 4.26 2.5 2.5 0 0 1-4.35 0 2.5 2.5 0 0 1 .52-4.26 2 2 0 0 1 1.95-1.54h.38a1 1 0 0 0 1-1V4.5A2.5 2.5 0 0 1 14.5 2z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.2a1 1 0 0 1-1 1h-.38a2 2 0 0 0-1.95 1.54 2.5 2.5 0 0 0-.52 4.26 2.5 2.5 0 0 0 4.35 0 2.5 2.5 0 0 0-.52-4.26 2 2 0 0 0-1.95-1.54h-.38a1 1 0 0 1-1-1V4.5A2.5 2.5 0 0 0 9.5 2z" /><path d="M12 13a2.5 2.5 0 0 0-2.5 2.5v.04a2.5 2.5 0 0 0 5 0V15.5A2.5 2.5 0 0 0 12 13z" /><path d="M18 11a2.5 2.5 0 0 0-2.5 2.5v.04a2.5 2.5 0 0 0 5 0V13.5A2.5 2.5 0 0 0 18 11z" /><path d="M6 11a2.5 2.5 0 0 0-2.5 2.5v.04a2.5 2.5 0 0 0 5 0V13.5A2.5 2.5 0 0 0 6 11z" /></>,
  collection: <><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></>,
  'chevron-down': <polyline points="6 9 12 15 18 9" />,
  microphone: <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
  wand: <><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2 18l-2 4 4-2 16.36-16.36a1.21 1.21 0 0 0 0-1.72z" /><path d="m14 7 3 3" /></>,
  star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
  crown: <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" /></>,
  compass: <><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></>,
  home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
  'message-circle': <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  'user-circle': <><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></>,
  copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
  refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
};

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const icon = ICONS[name];

  if (!icon) {
    return null; // Or return a default icon
  }
  
  const { className: divClassName, ...restProps } = props as any;

  // The div wrapper must have `pointer-events-none` to prevent it from intercepting
  // clicks meant for a parent element (like a button).
  const wrapperClassName = `${divClassName || ''} pointer-events-none`.trim();

  // The SVG element must ALSO have `pointer-events-none` to ensure it doesn't
  // capture clicks, which can happen in some browser/CSS configurations.
  const svgClassName = `${className || ''} pointer-events-none`.trim();

  return (
    <div {...restProps} className={wrapperClassName}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={svgClassName}
      >
        {icon}
      </svg>
    </div>
  );
};