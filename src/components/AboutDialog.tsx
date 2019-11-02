import React from "react";
import { Modal, Button } from "semantic-ui-react";

export interface IAboutDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function(props: IAboutDialogProps) {
    return (
        <Modal closeOnDimmerClick={true} closeOnEscape={true} onClose={props.onClose} open={props.isOpen}>
            <Modal.Header>About</Modal.Header>
            <Modal.Content>
                <p>
                    <a href="https://github.com/russleyshaw/videogames">GitHub</a>
                </p>
                <p>Uses the Giant Bomb API.</p>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={props.onClose}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
}
