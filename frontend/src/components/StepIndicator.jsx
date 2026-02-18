export default function StepIndicator({ current }) {
    const steps = ['Setup', 'Record', 'Share']
    return (
        <div className="steps">
            {steps.map((label, i) => {
                const n = i + 1
                const isDone = n < current
                const isActive = n === current
                return (
                    <div key={label} className="flex items-center">
                        <div className={`step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="step-num">{isDone ? '✓' : n}</div>
                            <span>{label}</span>
                        </div>
                        {i < steps.length - 1 && <div className="step-connector" />}
                    </div>
                )
            })}
        </div>
    )
}
