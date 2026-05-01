  import { toast } from "sonner";
  import { WarningFilled, InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";

  export function toastSucesso(msg:string) {
    toast(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}><CheckCircleFilled /></span>
          <strong style={{ fontSize: '16px', fontFamily: 'Geist', fontWeight: 600 }}>
            Sucesso
          </strong>
        </div>
        <span style={{ fontSize: '15px', fontFamily: 'Geist' }}>
          {msg}
        </span>
      </div>,
      {
        style: {
          background: '#E6F4EA',      // verde claro
          color: '#1E4620',           // verde escuro para o texto
          border: '1px solid #A5D6A7',
          borderLeft: '6px solid #169c33', // faixa mais escura à esquerda
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Geist',
        }
      }
    );
  }

  export function toastAviso(msg:string) {
    toast(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}><WarningFilled/></span>
          <strong style={{ fontSize: '16px', fontFamily: 'Geist', fontWeight: 600 }}>
            Aviso
          </strong>
        </div>
        <span style={{ fontSize: '15px', fontFamily: 'Geist' }}>
          {msg}
        </span>
      </div>,
      {
        style: {
          background: '#FFF4E5',
          color: '#7A4F01',
          border: '1px solid #FFCC80',
          borderLeft: '6px solid #FF9800',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Geist',
        }
      }
    );
  }

  export function toastErro(msg:string) {
    toast(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}><CloseCircleFilled /></span>
          <strong style={{ fontSize: '16px', fontFamily: 'Geist', fontWeight: 600 }}>
            Erro
          </strong>
        </div>
        <span style={{ fontSize: '15px', fontFamily: 'Geist' }}>
          {msg}
        </span>
      </div>,
      {
        style: {
          background: '#FDECEA',
          color: '#611A15',
          border: '1px solid #EF9A9A',
          borderLeft: '6px solid #E53935',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Geist',
        }
      }
    );
  }

  export function toastInfo(msg:string) {
    toast(
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px', marginRight: '8px' }}><InfoCircleFilled /></span>
          <strong style={{ fontSize: '16px', fontFamily: 'Geist', fontWeight: 600 }}>
            Info
          </strong>
        </div>
        <span style={{ fontSize: '15px', fontFamily: 'Geist' }}>
          {msg}
        </span>
      </div>,
      {
        style: {
          background: '#E8F4FD',
          color: '#0D3C61',
          border: '1px solid #90CAF9',
          borderLeft: '6px solid #1E88E5', 
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'Geist',
        }
      }
    );
  }
