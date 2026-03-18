'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { demoEvents } from '@/lib/demo-data';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';
import { Check, Ticket, Zap, AlertCircle } from 'lucide-react';

export default function MintPage() {
    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedTier, setSelectedTier] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [minted, setMinted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mintedResult, setMintedResult] = useState<any>(null);

  const event = demoEvents.find(e => e.id === selectedEvent);
    const tier = event?.tiers.find(t => t.id === selectedTier);
    const remaining = tier ? tier.capacity - tier.sold : 0;

  const handleMint = async () => {
        if (!event || !tier) return;
        setLoading(true);
        setError(null);
        setMintedResult(null);
        try {
                const res = await fetch('/api/tickets', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                                      eventId: event.id,
                                      eventName: event.name,
                                      tierId: tier.id,
                                      tierName: tier.name,
                                      quantity,
                                      price: tier.price,
                                      ownerWallet: 'demo-wallet',
                                      ticketData: {
                                                    status: 'active',
                                                    event: event.name,
                                                    tier: tier.name,
                                                    price: tier.price,
                                      },
                          }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || 'Mint failed');
                setMintedResult(json.data);
                setMinted(true);
                setTimeout(() => setMinted(false), 4000);
        } catch (err: any) {
                setError(err.message || 'Something went wrong');
        } finally {
                setLoading(false);
        }
  };

  return (
        <div className="max-w-2xl mx-auto space-y-6">
              <Card>
                      <CardHeader>
                                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Zap size={18} className="text-brand-600" /> Batch Mint Tickets
                                </h2>h2>
                                <p className="text-xs text-gray-500 mt-1">Create DUAL tokens for an event tier. Each ticket becomes a unique on-chain asset.</p>p>
                      </CardHeader>CardHeader>
                      <CardContent className="space-y-4">
                        {/* Event selector */}
                                <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Event</label>label>
                                            <select
                                                            value={selectedEvent}
                                                            onChange={(e) => { setSelectedEvent(e.target.value); setSelectedTier(''); }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                                          >
                                                          <option value="">Select an event...</option>option>
                                              {demoEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled').map(e => (
                                                                            <option key={e.id} value={e.id}>{e.name}</option>option>
                                                                          ))}
                                            </select>select>
                                </div>div>
                      
                        {/* Tier selector */}
                        {event && (
                      <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>label>
                                    <div className="space-y-2">
                                      {event.tiers.map((t) => (
                                          <button
                                                                key={t.id}
                                                                onClick={() => setSelectedTier(t.id)}
                                                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                                                                        selectedTier === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                                                                }`}
                                                              >
                                                              <div className="flex justify-between">
                                                                                    <span className="font-medium text-sm">{t.name}</span>span>
                                                                                    <span className="text-sm font-bold">{formatCurrency(t.price)}</span>span>
                                                              </div>div>
                                                              <p className="text-xs text-gray-500 mt-0.5">{t.sold} sold / {t.capacity} capacity — {t.capacity - t.sold} remaining</p>p>
                                          </button>button>
                                        ))}
                                    </div>div>
                      </div>div>
                                )}
                      
                        {/* Quantity */}
                        {tier && (
                      <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>label>
                                    <div className="flex items-center gap-3">
                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        max={remaining}
                                                                        value={quantity}
                                                                        onChange={(e) => setQuantity(Math.min(Number(e.target.value), remaining))}
                                                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                                                      />
                                                    <span className="text-sm text-gray-500">of {remaining} available</span>span>
                                    </div>div>
                      </div>div>
                                )}
                      
                        {/* Summary */}
                        {tier && quantity > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                    <p className="text-sm font-medium text-gray-700">Mint Summary</p>p>
                                    <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Event</span>span>
                                                    <span className="font-medium">{event?.name}</span>span>
                                    </div>div>
                                    <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">Tier</span>span>
                                                    <span className="fon'tu-smee dciluime"n>t{'t;i
                                                      e
                                                    ri.mnpaomret} <{/ sCpaarnd>,
                                                        C a r d C o n t e n t ,   C<a/rddiHve>a
                                                    d e r   }   f r o m   ' @ / c<odmipvo ncelnatsss/Nuaim/eC=a"rfdl'e;x
                                                     ijmupsotritf y{- bBeuttwteoenn  }t efxrto-ms m'"@>/
                                                    c o m p o n e n t s / u i / B u t<tsopna'n; 
                                                    cilmapsosrNta m{e =d"etmeoxEtv-egnrtasy -}6 0f0r"o>mQ u'a@n/tliitby/<d/esmpoa-nd>a
                                                    t a ' ; 
                                                     i m p o r t   {   f o r<msaptaCnu rcrleanscsyN a}m ef=r"ofmo n't@-/mleidbi/uumt"i>l{sq'u;a
                                                    nitmiptoyr}t  t{i cukseetSst<a/tsep a}n >f
                                                    r o m   ' r e a c t ' ; 
                                                     i m<p/odritv >{
                                                         C h e c k ,   T i c k e t ,< dZiavp ,c lAalsesrNtaCmier=c"lfel e}x  fjruosmt i'flyu-cbiedtew-ereena ctte'x;t
                                                    -
                                                    semx"p>o
                                                    r t   d e f a u l t   f u n c t i<osnp aMni nctlPaasgseN(a)m e{=
                                                    " t ecxotn-sgtr a[ys-e6l0e0c"t>eTdeEmvpelnatt,e <s/estpSaenl>e
                                                    c t e d E v e n t ]   =   u s e S<tsaptaen( 'c'l)a;s
                                                    s N acmoen=s"tf o[nste-lmeocntoe dtTeixetr-,x ss"e>tdSuealle-cttiecdkTeitesr:]: e=v eunste-Sttiactkee(t':':)v;1
                                                    < / scpoanns>t
                                                      [ q u a n t i t y ,   s e t<Q/udainvt>i
                                                    t y ]   =   u s e S t a t e (<1d)i;v
                                                      c lcaosnssNta m[em=i"nbtoerdd,e rs-ett Mbionrtdeedr]- g=r auys-e2S0t0a tpet(-f2a lfslee)x; 
                                                    j u sctoinfsyt- b[eltowaedeinn gt,e xste-tsLmo"a>d
                                                    i n g ]   =   u s e S t a t e ( f<aslpsaen) ;c
                                                    l a scsoNnasmte =["efrornotr-,m esdeituEmr"r>oTro]t a=l  uFsaecSet aVtael<uset<r/isnpga n|> 
                                                    n u l l > ( n u l l ) ; 
                                                         c o<nsspta n[ mcilnatsesdNRaemseu=l"tf,o nste-tbMoilndt etdeRxets-ublrta]n d=- 6u0s0e"S>t{aftoer<maantyC>u(rnruelnlc)y;(
                                                    t
                                                    i e rc.opnrsitc ee v*e nqtu a=n tdietmyo)E}v<e/nstpsa.nf>i
                                                    n d ( e   = >   e . i d   = =<=/ dsievl>e
                                                    c t e d E v e n t ) ; 
                                                      < /cdoinvs>t
                                                        t i e r   =   e v e)n}t
                                                      ?
                                                      . t i e r s . f i n d{(etr r=o>r  t&.&i d( 
                                                      = = =   s e l e c t e d T<ideirv) ;c
                                                      l a scsoNnasmte =r"efmlaeixn iintge m=s -tsitearr t?  gtaipe-r2. cpa-p3a cbigt-yr e-d -t5i0e rb.osrodledr  :b o0r;d
                                                      e
                                                      r - rceodn-s2t0 0h arnodulnedMeidn-tl g=  taesxytn-cs m( )t e=x>t -{r
                                                        e d - 7 0i0f" >(
                                                      ! e v e n t   | |   ! t i e r<)A lreerttuCrinr;c
                                                      l e   s iszeet=L{o1a6d}i ncgl(atsrsuNea)m;e
                                                      = " m t -s0e.t5E rsrhorri(nnku-l0l") ;/
                                                      > 
                                                            s e t M i n t e d R e s<uslpta(nn>u{lelr)r;o
                                                      r } < / stprayn >{
                                                        
                                                                     c o n s t  <r/edsi v=> 
                                                      a w a i t   f e t c h)(}'
                                                      /
                                                      a p i / t i c k e t s{'m,i n{t
                                                        e d   & &   m i nmteetdhRoeds:u l'tP O&S&T '(,
                                                      
                                                                       h e a d<edrisv:  c{l a'sCsoNnatmeen=t"-pT-y3p eb'g:- g'raepepnl-i5c0a tbioornd/ejrs obno'r d}e,r
                                                      - g r e e n - 2 0b0o dryo:u nJdSeOdN-.lsgt rtienxgti-fsym( {t
                                                        e x t - g r e e n - 7e0v0e"n>t
                                                      I d :   e v e n t . i d , 
                                                        < p   c l a s s N aemvee=n"tfNoanmte-:m eedvieunmt .fnlaemxe ,i
                                                      t e m s - c e n t e rt igearpI-d1:" >t<iCehre.cikd ,s
                                                        i z e = { 1 4 }   / >t iMeirnNtaemde :o nt iDeUrA.Ln<a/mpe>,
                                                        
                                                                             q u a n<tpi tcyl,a
                                                        s s N a m e = " t e xptr-ixcse :m tt-i1e rf.opnrti-cmeo,n
                                                        o   b r e a k - a l lo wtneexrtW-aglrleeetn:- 6'0d0e"m>oI-Dw:a l{lmeitn't,e
                                                        d R e s u l t . i d  t|i|c kmeitnDtaetdaR:e s{u
                                                          l t . _ i d   | |   J S OsNt.asttursi:n g'iafcyt(imvien't,e
                                                        d R e s u l t ) . s l i ceev(e0n,t :8 0e)v}e<n/tp.>n
                                                        a m e , 
                                                                        < / d i vt>i
                                                                        e r :   t i e r . n a)m}e
                                                                        ,
                                                                        
                                                                                            < B uptrtiocne
                                                                                              :   t i e r . p r i c e ,c
                                                                        l a s s N a m e = " w}-,f
                                                                        u l l " 
                                                                          } ) , 
                                                                                  s i}z)e;=
                                                                        " l g " 
                                                                            c o n s t   j s o n  d=i saawbalietd =r{e!st.ijesro n|(|) ;q
                                                                        u a n t i t yi f<  (1! r|e|s .looka)d itnhgr o|w|  nmeiwn tEerdr}o
                                                                        r ( j s o n . m e s s a goen C|l|i c'kM=i{nhta nfdalielMeidn't)};
                                                                        
                                                                                     s e t M>i
                                                                        n t e d R e s u l t ( j s{olno.addaitnag) ;?
                                                                          ( 
                                                                                s e t M i n t e d ( t<rsupea)n; 
                                                                        c l a s s N asmeet=T"ifmleeoxu ti(t(e)m s=->c esnetteMri ngtaepd-(2f"a>l
                                                                        s e ) ,   4 0 0 0 ) ; 
                                                                          }< scvagt cchl a(sesrNra:m ea=n"ya)n i{m
                                                                            a t e - s p isne thE-r4r owr-(4e"r rv.imeewsBsoaxg=e" 0| |0  '2S4o m2e4t"h ifnigl lw=e"nnto nwer"o>n
                                                                        g ' ) ; 
                                                                          }   f i n a l l y  <{c
                                                                            i r c l e   csleatsLsoNaadmien=g"(ofpaalcsiet)y;-
                                                                        2 5 "   c}x
                                                                        = " 1}2;"
                                                                         
                                                                        c y =r"e1t2u"r nr =("
                                                                        1 0 "   s<tdriovk ec=l"acsusrNraemnet=C"omlaoxr-"w -s2txrlo kmexW-iaduttho= "s4p"a/c>e
                                                                        - y - 6 " > 
                                                                                     < C a r d ><
                        p a t h   c l a s<sCNaarmdeH=e"aodpearc>i
                                                                                     t y - 7 5 "   f i l l<=h"2c ucrlraesnstNCaomleo=r""f odn=t"-Ms4e m1i2bao8l d8  t0e x0t1-8g-r8avy8-H940z0" /f>l
                                                                                     e x   i t e m s - c e n t e r   g<a/ps-v2g">>
                                                                                     
                                                                                                              < Z a pM isnitzien=g{ 1o8n}  DcUlAaLs.s.N.a
                                                                                     m e = " t e x t - b r a n d -<6/0s0p"a n/>>
                                                                                       B a t c h   M i n t   T)i c:k emtisn
                                                                                     t e d   ?   ( 
                                                                                           < / h 2 > 
                                                                                                       < s p a n< pc lcalsassNsaNmaem=e"=f"lteexx ti-txesm st-ecxetn-tgerra yg-a5p0-02 "m>t<-C1h"e>cCkr esaitzee =D{U1A8L}  t/o>k e{nqsu afnotri tayn}  eTviecnkte tt{iqeura.n tEiatcyh  >t i1c k?e t' sb'e c:o m'e's}  aM iunntieqdu!e< /osnp-acnh>a
                                                                                                       i n   a s s e t . < / p >)
                                                                                                         :   ( 
                                                                                                               < / C a r d H e a d e<rs>p
                                                                                                               a n   c l a s s N<aCmaer=d"Cfolnetxe nitt ecmlsa-scseNnatmeer= "gsappa-c2e"->y<-T4i"c>k
                                                                                                               e t   s i z e = { 1 8{}/ */ >E vMeinntt  s{eqlueacnttoirt y*}/ }T
                                                                                                               i c k e t { q u a n t<idtiyv >>
                                                                                                                 1   ?   ' s '   :   ' '<}l<a/bsepla nc>l
                                                                                                                 a s s N a m e = " b l o c)k} 
                                                                                                                 t e x t - s m   f o n<t/-Bmuetdtiounm> 
                                                                                                                 t e x t - g r a y<-/7C0a0r dmCbo-n1t"e>nEtv>e
                                                                                                                 n t < / l a b<e/lC>a
                                                                                                                 r d > 
                                                                                                                          < / d i v<>s
                                                                                                                          e l e)c;t
                                                                                                                          
                                                                                                                            }              value={selectedEvent}
                                                                                                                                        onChange={(e) => { setSelectedEvent(e.target.value); setSelectedTier(''); }}
                                                                                                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                                                                                                                      >
                                                                                                                                        <option value="">Select an event...</option>option>
                                                                                                                            {demoEvents.filter(e => e.status !== 'completed' && e.status !== 'cancelled').map(e => (
                                        <option key={e.id} value={e.id}>{e.name}</option>option>
                                      ))}
                                                                                                                            </>select>
                                                                                                                            </>div>
                                                                                                                 
                                                                                                                   {/* Tier selector */}
                                                                                                                   {event && (
                                    <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-1">Tier</label>label>
                                                  <div className="space-y-2">
                                                    {event.tiers.map((t) => (
                                                        <button
                                                                              key={t.id}
                                                                              onClick={() => setSelectedTier(t.id)}
                                                                              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                                                                                      selectedTier === t.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
                                                                              }`}
                                                                            >
                                                                            <div className="flex justify-between">
                                                                                                  <span className="font-medium text-sm">{t.name}</span>span>
                                                                                                  <span className="text-sm font-bold">{formatCurrency(t.price)}</span>span>
                                                                            </div>div>
                                                                            <p className="text-xs text-gray-500 mt-0.5">{t.sold} sold / {t.capacity} capacity — {t.capacity - t.sold} remaining</p>p>
                                                        </button>button>
                                                      ))}
                                                  </div>div>
                                    </div>div>
                                                                                                                           )}
                                                                                                                 
                                                                                                                   {/* Quantity */}
                                                                                                                   {tier && (
                                    <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>label>
                                                  <div className="flex items-center gap-3">
                                                                  <input
                                                                                      type="number"
                                                                                      min={1}
                                                                                      max={remaining}
                                                                                      value={quantity}
                                                                                      onChange={(e) => setQuantity(Math.min(Number(e.target.value), remaining))}
                                                                                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                                                                    />
                                                                  <span className="text-sm text-gray-500">of {remaining} available</span>span>
                                                  </div>div>
                                    </div>div>
                                                                                                                           )}
                                                                                                                 
                                                                                                                   {/* Summary */}
                                                                                                                   {tier && quantity > 0 && (
                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                                  <p className="text-sm font-medium text-gray-700">Mint Summary</p>p>
                                                  <div className="flex justify-between text-sm">
                                                                  <span className="text-gray-600">Event</span>span>
                                                                  <span className="font-medium">{event?.name}</span>span>
                                                  </div>div>
                                                  <div className="flex justify-between text-sm">
                                                                  <span className="text-gray-600">Tier</span>span>
                                                                  <span className="font-medium">{tier.name}</span>span>
                                                  </div>div>
                                                  <div className="flex justify-between text-sm">
                                                                  <span className="text-gray-600">Quantity</span>span>
                                                                  <span className="font-medium">{quantity} tickets</span>span>
                                                  </div>div>
                                                  <div className="flex justify-between text-sm">
                                                                  <span className="text-gray-600">Template</span>span>
                                                                  <span className="font-mono text-xs">dual-tickets::event-ticket::v1</span>span>
                                                  </div>div>
                                                  <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
                                                                  <span className="font-medium">Total Face Value</span>span>
                                                                  <span className="font-bold text-brand-600">{formatCurrency(tier.price * quantity)}</span>span>
                                                  </div>div>
                                    </div>div>
                                                                                                                           )}
                                                                                                                 
                                                                                                                   {error && (
                                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                                  <span>{error}</span>span>
                                    </div>div>
                                                                                                                           )}
                                                                                                                 
                                                                                                                   {minted && mintedResult && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                                  <p className="font-medium flex items-center gap-1"><Check size={14} /> Minted on DUAL</p>p>
                                                  <p className="text-xs mt-1 font-mono break-all text-green-600">ID: {mintedResult.id || mintedResult._id || JSON.stringify(mintedResult).slice(0, 80)}</p>p>
                                    </div>div>
                                                                                                                           )}
                                                                                                                 
                                                                                                                           <Button
                                                                                                                                         className="w-full"
                                                                                                                                         size="lg"
                                                                                                                                         disabled={!tier || quantity < 1 || loading || minted}
                                                                                                                                         onClick={handleMint}
                                                                                                                                       >
                                                                                                                             {loading ? (
                                                                                                                                                       <span className="flex items-center gap-2">
                                                                                                                                                                       <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                                                                                                                                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                                                                                                                                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                                                                                                                                                         </svg>svg>
                                                                                                                                                                       Minting on DUAL...
                                                                                                                                                         </span>span>
                                                                                                                                                     ) : minted ? (
                                                                                                                                                       <span className="flex items-center gap-2"><Check size={18} /> {quantity} Ticket{quantity > 1 ? 's' : ''} Minted!</span>span>
                                                                                                                                                     ) : (
                                                                                                                                                       <span className="flex items-center gap-2"><Ticket size={18} /> Mint {quantity} Ticket{quantity > 1 ? 's' : ''}</span>span>
                                                                                                                                       )}
                                                                                                                             </Button>Button>
                                                                                                                   </>CardContent>
                                                                                                                   </>Card>
                                                                                                                   </>div>
                                                                                                                 );
                                                                                                                 }</></div>
