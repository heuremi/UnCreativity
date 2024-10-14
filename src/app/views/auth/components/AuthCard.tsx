import { ReactElement } from "react";
import './AuthCard.css';

interface Props {
    children: ReactElement;
}

export function AuthCard(props: Props) {
    return (
        <div className="container mycontainer">
            <div className="auth-card-wrapper">
                <div className="auth-card">
                    <div className="row">
                        <div className="col-12">
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
