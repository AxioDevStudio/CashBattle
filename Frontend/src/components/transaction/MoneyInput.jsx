import { Wallet } from "lucide-react";

function MoneyInput({ value, onChange }) {
    return (
        <div className="money-input">
            <Wallet size={22} />

            <input
                type="number"
                placeholder="0,00"
                value={value}
                onChange={(event) => onChange(event.target.value)}
            />
        </div>
    );
}

export default MoneyInput;
