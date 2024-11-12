import { AbstractProvider } from "ethers";

declare global {
    interface Window{
        ethereum?:Eip1193Provider;
    }
}

