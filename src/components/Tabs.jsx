import { useState, useEffect } from "react";
import { Button } from "./Button";

export const Tabs = ({ tabs, initialActive = 0 }) => {

    const [active, setActive] = useState(initialActive);
 
    useEffect(() => {
      setActive(initialActive);
    }, [initialActive, tabs]);
  return (
    <div>
        <div className="flex gap-2 mb-2">
            { tabs
                .filter(Boolean)
                .map((tab, index) => (
                <Button key={index} onClick={() => setActive(index)} variations={active === index ? 'primary' : 'outline'}>
                    {tab.title}
                </Button>
            ))}
        </div>
        { tabs[active]?.content }
    </div>
  );
}
