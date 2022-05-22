import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { useForm } from "react-hook-form"
import * as Yup from 'yup';

export type BugFormData = {
    name: string;
    description: string;
}

export default function BugForm({onSubmit}: {onSubmit: (data: BugFormData) => void}) {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .required('Name is required'),
        description: Yup.string()
            .required('Description is required')
    });

    const { register, handleSubmit, formState: {errors} }
        = useForm<BugFormData>({
            resolver: yupResolver(validationSchema),
            defaultValues:
            {
                name: '',
                description: ''
            }
    });


    return <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{width: '800px'}} className='form-group'>
            <input
              style={{width: '250px'}}
              type='text'
              placeholder='Name'
              {...register('name')}
              className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            />
            <div className='gap'/>
            <textarea
              style={{resize: 'none'}}
              placeholder='Description'
              {...register('description')}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            />
        </div>
        <div className='form-group'>
            <button type='submit' className='btn btn-primary' data-testid='login' id='submitBtn'>
                Report
            </button>
        </div>
    </form>
}