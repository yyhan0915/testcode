import React from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorBoundaryBlock = styled.div<IProps>`
    width: 100%;
    height: ${props => (props.height ? props.height : '100%')};
    min-height: ${props => (props.height ? props.height : '200px')};
    background-color: ${props => (props.backgroundColor ? props.backgroundColor : undefined)};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
`;

interface IProps {
    height?: string;
    backgroundColor?: string;
    title?: string;
}

const ErrorFallback: React.FC = () => {
    return (
        <ErrorBoundaryBlock>
            <div
                dangerouslySetInnerHTML={{
                    __html: `Something went wrong temporarily <br /> Please try again.`,
                }}
            />
        </ErrorBoundaryBlock>
    );
};

const ErrorBoundaryComponent: React.FC<IProps> = ({ children }) => {
    return <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>;
};

export default ErrorBoundaryComponent;
