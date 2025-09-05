export interface ClinicsStatus {
  _id?: string;
  href: string;
  active: boolean;
  hasThemeImage: boolean;
  image: string;
  name: string;
  customStyle?: {};
  createdAt: Date;
  updatedAt: Date;
}
const getClinicsStatus = async (currentRouteName: string) => {
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_adminUrl}/publications/clinicsStatus`,
      { method: "GET" }
    );
    const clinicsstatus = await data.json();
    let currentClinick = clinicsstatus.filter(
      (a: ClinicsStatus) => a.href == currentRouteName
    ) as ClinicsStatus[];
    if (currentClinick.length !== 0) {
      return currentClinick[0]?.active;
    } else {
      return false;
    }
  } catch (error) {
    console.log("getClinicsStatus error : ", error);
    return false;
  }
};

export default getClinicsStatus;
