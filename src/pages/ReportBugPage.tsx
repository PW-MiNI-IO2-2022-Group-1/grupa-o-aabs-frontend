import { useNavigate } from "react-router";
import { useAuth } from "../components/AuthComponents";
import BugForm, { BugFormData } from "../components/forms/BugForm";
import { useSimpleModal } from "../components/modals/useSimpleModal";
import { reportBug } from "../logic/bugAPI";

export default function ReportBugPage() {
    const auth = useAuth();
    const [showModal, renderModal] = useSimpleModal();
    const navigate = useNavigate()

    const onSubmit = (data: BugFormData) => {
        reportBug(auth, data).catch((error) => {
            showModal('Error', 'Unexpected error');
        }).then(() => {
            showModal('Success', 'You have successfully reported a bug.', () => {
               navigate(-1);
            });
        });
    }

    return (<>
            {renderModal()}
            <header>Report a bug
                <div className='gap'/>
                <BugForm onSubmit={onSubmit}></BugForm>
            </header>
        </>
    )
}