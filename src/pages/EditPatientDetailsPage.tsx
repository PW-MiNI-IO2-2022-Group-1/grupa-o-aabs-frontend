import { Patient } from '../types/users';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { EditField } from '../components/EditField';
import { useAuth } from '../components/AuthComponents';

type PatientDetailsForm = {
    firstName: string;
    lastName: string;
    city: string;
    zipCode: string;
    street: string;
    houseNumber: string;
    localNumber: string;
};

function EditPatientDetailsPage(): JSX.Element {
    const patient: Patient = useAuth().user as Patient;

    const displayNames = {
        'firstName': 'First name',
        'lastName': 'Last name',
        'city': 'City',
        'zipCode': 'Zip code',
        'street': 'Street',
        'houseNumber': 'House number',
        'localNumber': 'Local number'
    };

    const validationSchema = Yup.object().shape({
        firstName: Yup.string().min(2, 'First name is required')
        .matches(RegExp(/[A-Z].+/g), "First name has to start with uppercase letter"),
        lastName: Yup.string().min(2, 'Last name is required')
        .matches(RegExp(/[A-Z].+/g), "Last name has to start with uppercase letter"),
        city: Yup.string().required('City is required')
        .matches(RegExp(/[A-Z].+/g), "City has to start with uppercase letter"),
        zipCode: Yup.string().required('Zip code is required')
        .matches(RegExp(/\d\d-\d\d\d/g), "Zip code is invalid"),
        street: Yup.string().required('Street is required'),
        houseNumber: Yup.string().required('House number is required'),
        localNumber: Yup.string()
    });

    const form = useFormik<PatientDetailsForm>({
        initialValues: {
            firstName: patient.firstName!,
            lastName: patient.lastName!,
            city: patient.address.city!,
            zipCode: patient.address.zipCode!,
            street: patient.address.street!,
            houseNumber: patient.address.houseNumber!,
            localNumber: patient.address.localNumber ?? ""
        },
        validationSchema: validationSchema,
        onSubmit: values => {
            console.log(values);
        }
    });

    return (<div className='LoginPage'>
        <header className='LoginPage-header'>Patient details
            <div className='gap'/>
            <form className='form-container' data-testid='form'>
            {Object.keys(form.values).map((key) => {
                const error = (form.errors as any)[key];
                const displayName = (displayNames as any)[key];
                return <EditField key={key} valueKey={key} displayName={displayName}
                    values={form.values} handleChange={form.handleChange}
                    error={error}/>
            })}
            <button type='submit' className='btn btn-primary center-block p-2'>Change details</button>
        </form>
        </header></div>
    ); 
}

export { EditPatientDetailsPage };