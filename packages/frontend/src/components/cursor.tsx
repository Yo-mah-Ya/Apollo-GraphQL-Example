import { FC, memo, MutableRefObject, useState } from "react";

const Pagination: FC<{
    orderRef: MutableRefObject<HTMLSelectElement | null>;
    lengthRef: MutableRefObject<HTMLInputElement | null>;
    cursorRef: MutableRefObject<HTMLInputElement | null>;
}> = ({ orderRef, lengthRef, cursorRef }) => {
    const [order, setOrder] = useState(orderRef.current?.value);
    return (
        <>
            <div>
                <select
                    name="allPeople"
                    id="allPeople"
                    ref={orderRef}
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <option value="first">first</option>
                    <option value="forward">forward</option>
                    <option value="backward">backward</option>
                </select>
                <div>
                    <p>length</p>
                    <input
                        type="number"
                        name="length"
                        id="length"
                        required
                        ref={lengthRef}
                    />
                    {order === "forward" || order === "backward" ? (
                        <>
                            <p>{order}</p>
                            <input
                                type="text"
                                name="cursor"
                                id="cursor"
                                required
                                ref={cursorRef}
                            />
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
};

export default memo(Pagination);
