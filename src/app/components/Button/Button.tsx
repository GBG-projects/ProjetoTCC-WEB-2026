type buttonProps = {
    text: string;
}

export default function Button ({text}:buttonProps){
    
    return(
        <button className="bg-red-500 p-3 w-40 h-15 rounded-xl">{text}</button>
    )
}