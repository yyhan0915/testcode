import React, { ComponentType } from 'react';
import ErrorBoundaryComponent from 'src/components/common/error/ErrorBoundary';

function withErrorBoundary<P>(WrappedComponent: ComponentType<P>): React.FC<P> {
    const WithComponent = props => {
        return (
            <ErrorBoundaryComponent>
                <WrappedComponent {...(props as P)} />
            </ErrorBoundaryComponent>
        );
    };

    return WithComponent;
}

export default withErrorBoundary;
