import IDetails from "./IDetails";

interface IUser {
    id: string;
    cboFTitle: string;
    cboLivingStatus: string;
    cboMaskanName: string;
    cboTitle: string;
    cboWatanCode:string;
    txtEjamaat_ID:string;
    txtFatherName:string;
    txtSabeelNo:string;
    txtSurname:string;
    txtThaaliNo:string;
    txtMuminName:string;
    txtAmountTakhmeen: string;
    txtAmountDue: string;
    thaali_status: IDetails
}

export default IUser;