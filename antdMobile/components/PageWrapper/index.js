import React from 'react';


const PageWrapper = ({ children , white = false}) => {
    const style = white ? {backgroundColor: 'white'} : {};
    return (
        <div style={{ height: '100%',overflow: 'scroll',...style }}>
            {children}
        </div>
    );
}
export default PageWrapper;
