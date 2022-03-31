import React, { useState } from 'react';
import * as Icon from 'react-bootstrap-icons';

interface EditFieldProps<T> {
    valueKey: string;
    displayName: string;
    values: T
    handleChange: React.ChangeEventHandler<HTMLInputElement>,
    error: string | undefined
};

function EditField<T>(props: EditFieldProps<T>) {
    const key = props.valueKey;
    const [isEnabled, setEnabled] = useState<boolean>(false);

    const toggleEnabled = (e: React.MouseEvent) => {
        e.preventDefault();
        setEnabled((isEnabled) => !isEnabled);
    }

    return (<div>
        <label className='form-label text-sm start' 
               id={key}>{props.displayName}
        </label>
        <div className='d-flex flex-row p-0 py-0 m-0'>
            <div className=''>
            <input
                id={key}
                disabled={!isEnabled}
                type='text'
                onChange={props.handleChange}    
                value={(props.values as any)[key]}
                className={`form-control${props.error === undefined 
                    ? '' 
                    : ' is-invalid'}`}
            />
            </div>
            <div className='my-1 mx-2 py-0'>
                <button type="button" 
                    onClick={toggleEnabled}
                    className="btn btn-primary \
                    btn-sm position-absolute pb-1 pt-0 mt-1">
                        <Icon.PencilSquare/>
                </button>
            </div>
        </div>
        {props.error === undefined
            ? <div className='gap'/>
            : <div className='invalidfeedback text-small'>
                {props.error}
              </div>
        }
    </div>);
}

export { EditField };