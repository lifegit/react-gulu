import * as React from 'react';


export interface SimpleRegionTownProps {
    other?:{};
    county?: { code: string; name: string };
    onChange?: (value: string) => void;
}

export class SimpleRegionTown extends React.Component<SimpleRegionTownProps, any> {}






export interface SimpleRegionProps {
    other?:{};
    filtered?: { province: []; city: []; county: [] };
    onChange?: (value: string) => void;
}

export default class SimpleRegion extends React.Component<SimpleRegionProps, any> {
    static SimpleRegionTown: typeof SimpleRegionTown;
}