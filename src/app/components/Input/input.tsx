import { HeapInfo } from "v8";

type inputProps = {
    fontSize?: number | 18,
    className?:string,
    textLabel:string,
    type: string,
    placeholder: string,
    value: string,
    id:string
    setValue:(value: string) => void;
}

export default function Input({textLabel,type, placeholder, value, id, setValue}:inputProps){
    return(
        <div className="flex flex-col w-fit">
        <label htmlFor={id}>{textLabel}</label>
        <input className=" w-70 h-12" type={type} placeholder={placeholder} value={value} id={id} onChange={(e) => setValue(e.target.value)}/>
        </div>
    )
}