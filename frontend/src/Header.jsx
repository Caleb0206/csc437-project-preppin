
export function Header({ leftSlot = null, rightSlot = null }) {
    return (
        <header className="site-header">
            <div className="header-left">
                {leftSlot}
            </div>
            <h1 className="site-title">Preppin'</h1>
            <div className="header-right" >
                {rightSlot}
            </div>
        </header >
    )
}