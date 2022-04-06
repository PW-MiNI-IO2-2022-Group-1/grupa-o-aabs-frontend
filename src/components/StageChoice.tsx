import './StageChoice.css';

interface StageChoiceProps {
    stages: String[];
    currentStage: number;
    onChoiceCallback: (stateNumber: number) => void;
}

function StageChoice(props: StageChoiceProps) {
    return (<>
        <div className='d-flex'>
            {props.stages.map((stage, index) => {
                if(index === props.currentStage)
                    return (<div className='stage-container stage-container-chosen'>
                        <button style={{padding: 0, border: 'none', background: 'none'}}>
                            <h2 className='d-inline text-light m-5 noselect'>{stage}</h2>
                        </button>
                    </div>);
                else
                    return (<div onClick={() => props.onChoiceCallback(index)} className='stage-container'>
                        <button style={{padding: 0, border: 'none', background: 'none'}}>
                            <h2 className='d-inline text-light m-5 noselect'>{stage}</h2>
                        </button>
                    </div>);
            })}
        </div>
    </>);
}

export default StageChoice;