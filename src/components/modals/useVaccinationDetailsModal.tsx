import { useState } from "react";
import { Button, Container, Modal } from "react-bootstrap";
import { PatientVaccination } from "../../types/vaccination";

interface VaccinationDetailsModalState {
    isVisible: boolean;
    vaccination?: PatientVaccination;
}

export default function useVaccinationDetailsModal(): [(vacc: PatientVaccination) => void, () => JSX.Element] {
    const [state, setState] = useState<VaccinationDetailsModalState>({
        isVisible: false
    });

    function showModal(vaccination: PatientVaccination) {
        setState({
            isVisible: true,
            vaccination: vaccination
        });
    }

    function closeModal() {
        setState({
            isVisible: false
        });
    }

    function renderModal() {
        return <Modal show={state.isVisible} onHide={closeModal}
               backdrop='static'>
            <Modal.Header>
                <Modal.Title>Vaccination</Modal.Title>     
            </Modal.Header>
            <Modal.Body>
                <h4>Vaccine: {state.vaccination?.vaccine.name}</h4>
                <h4>Disease: {state.vaccination?.vaccine.disease}</h4>
                <h4>Date: {state.vaccination?.vaccinationSlot.date.toLocaleDateString()}</h4>
                <h4>Appointment time: {state.vaccination?.vaccinationSlot.date.toLocaleTimeString()}</h4>
                <h4>Doctor's name: {state.vaccination?.doctor.firstName + ' '
                    + state.vaccination?.doctor.lastName}</h4>
                <h4>Status: {state.vaccination?.status}</h4>
            </Modal.Body>
            <Modal.Footer>
                <Button variant='dark' onClick={closeModal}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    }

    return [showModal, renderModal]

}