interface StageChoiceProps<T> {
    currentStage: T;
    stageNames: Map<T, String>
    onChoiceCallback: (stage: T) => void;
}

function StageChoice<T>(props: StageChoiceProps<T>) {
    return (<>
        <div className='d-flex justify-content-between'
                style={{width: '1000px'}}>
            {Array.from(props.stageNames).map(([stage, stageName]) =>
                <button className={stage === props.currentStage
                                    ? 'btn btn-dark btn-rounded'
                                    : 'btn btn-light btn-roundend btn-outline-dark'}
                        onClick={() => props.onChoiceCallback(stage)}>
                    <h2 className='d-inline m-5 noselect'>{stageName}</h2>
                </button>
            )}
        </div>
    </>);
}

export default StageChoice;