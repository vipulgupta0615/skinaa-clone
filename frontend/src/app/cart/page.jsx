import Cart, { BagLink } from '../../components/Cart';
export const metadata = { title: 'Your bag — SKINAA' };
export default function CartPage(){return <><header className="site-header"><a className="brand" href="/">✦ SKINAA</a><div className="header-actions"><a className="text-link" href="/#essentials">Shop essentials</a><BagLink /></div></header><Cart/></>;}
