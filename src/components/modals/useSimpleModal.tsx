import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

interface SimpleModalState {
    isVisible: boolean;
    title: string;
    message: string;
    callback: (() => void) | undefined;
}

export function useSimpleModal(): [(title: string, message: string, callback?: () => void) => void,
                                   () => JSX.Element] {
    const [state, setState] = useState<SimpleModalState>(
        {
            isVisible: false,
            title: "",
            message: "",
            callback: undefined
        }
    );

    const closeModal = () => {
        setState((oldState) => {
            oldState.isVisible = false;
            return {...oldState};
        });
    }

    const showModal = (title: string, message: string, callback?: () => void) => {
        setState({
            isVisible: true,
            title: title,
            message: message,
            callback: callback
        });
    }

    const onClose = () => {
        closeModal();
        if(state.callback !== undefined)
            state.callback();
    }

    const renderModal = () => {
        return <Modal show={state.isVisible} onHide={closeModal}
               backdrop='static'>
            <Modal.Header>
                <Modal.Title>{state.title}</Modal.Title>     
            </Modal.Header>
            <Modal.Body>{state.message}</Modal.Body>
            <Modal.Footer>
                <Button variant='primary' onClick={onClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    }

    return [showModal, renderModal];
}