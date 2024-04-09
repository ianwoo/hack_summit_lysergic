import { useEffect, useState } from "react";
import "./Lysergic.scss";
import Table from "../table/Table";
import { ColType } from "../../types";

function Lysergic() {
  const [bannerAnim, setBannerAnim] = useState("");
  useEffect(() => {
    setBannerAnim("animate ");
  }, []);

  return (
    <div className="lysergic">
      <div className="banner">
        <h1 className={bannerAnim + "d1"}>L</h1>
        <h1 className={bannerAnim + "d2"}>Y</h1>
        <h1 className={bannerAnim + "d3"}>S</h1>
        <h1 className={bannerAnim + "d4"}>E</h1>
        <h1 className={bannerAnim + "d5"}>R</h1>
        <h1 className={bannerAnim + "d6"}>G</h1>
        <h1 className={bannerAnim + "d7"}>I</h1>
        <h1 className={bannerAnim + "d8"}>C</h1>
        <h1 className="blinker">_</h1>
      </div>
      <Table
        headers={[
          { label: "Product", type: ColType.String, prefix: "", suffix: "" },
          { label: "APR", type: ColType.String, prefix: "", suffix: "" },
          { label: "Deposit Asset", type: ColType.String, prefix: "", suffix: "" },
          { label: "Stake Token", type: ColType.String, prefix: "", suffix: "" },
          { label: "Liquid Yield Token", type: ColType.String, prefix: "", suffix: "" },
        ]}
        data={[
          ["Lysergic MSOL", "18%", "SOL", "LS-SOL", "LY-SOL"],
          ["Lysergic MSOL", "19%", "SOL", "LS-SOL", "LY-SOL"],
          ["Lysergic MSOL", "20%", "SOL", "LS-SOL", "LY-SOL"],
          ["Lysergic MSOL", "21%", "SOL", "LS-SOL", "LY-SOL"],
        ]}
        alignRightLastCol={false}
        colClasses={["fifth", "twelve", "fifth", "twelve", "fifth"]}
      />
    </div>
  );
}

export default Lysergic;
