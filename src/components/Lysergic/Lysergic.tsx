import { useEffect, useState } from "react";
import "./Lysergic.scss";
import Table from "../table/Table";
import { ColType } from "../../types";
import { Connection } from "@solana/web3.js";

function Lysergic() {
  const [bannerAnim, setBannerAnim] = useState("");

  const connection = new Connection("https://api.devnet.solana.com");

  const date = new Date();
  const twelve = new Date(date.setFullYear(date.getFullYear() + 1));
  const eighteen = new Date(date.setFullYear(date.getFullYear() + 1.5));
  const twentyfour = new Date(date.setFullYear(date.getFullYear() + 2));

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
          { label: "Vesting Date", type: ColType.Date, prefix: "", suffix: "" },
          { label: "Deposit Asset", type: ColType.String, prefix: "", suffix: "" },
          { label: "Stake Token", type: ColType.String, prefix: "", suffix: "" },
          { label: "Liquid Yield Token", type: ColType.String, prefix: "", suffix: "" },
          { label: "Actions", type: ColType.Actions, prefix: "", suffix: "" },
        ]}
        data={[
          ["Lysergic MSOL", twelve.getTime().toString(), "SOL", "LS-SOL", "LY-SOL"],
          ["Lysergic MSOL", eighteen.getTime().toString(), "SOL", "LS-SOL", "LY-SOL"],
          ["Lysergic MSOL", twentyfour.getTime().toString(), "SOL", "LS-SOL", "LY-SOL"],
        ]}
        alignRightLastCol={false}
        colClasses={["fifth", "twelve", "fifth", "twelve", "fifth"]}
      />
    </div>
  );
}

export default Lysergic;
