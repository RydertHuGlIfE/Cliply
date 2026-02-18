export default function StepIndicator({ current }) {
    const steps = ['Setup', 'Record', 'Share']
    return (
        <div className="steps mb-40">
            {steps.map((label, i) => {
                const n = i + 1
                const isDone = n < current
                const isActive = n === current
                return (
                    <div key={label} className="flex items-center">
                        <div className={`step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
                            <div className="step-num font-teko text-2xl">
                                {isDone ? '✓' : n}
                            </div>
                            <span className="font-teko uppercase text-xl tracking-widest">{label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`step-connector ${isDone ? 'done' : ''}`} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}
