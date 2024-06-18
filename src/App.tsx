import { Reducer, useEffect, useReducer } from 'react';
import { useGlobalModalList, useModalList, useToggleModal } from '@/lib';
import NoPropsModal from './NoPropsModal';
import TestModal from './TestModal';

function App() {
  const [, forceUpdate] = useReducer<Reducer<boolean, void>>((b) => !b, false);

  console.log('rerendered');

  const { ModalComponentList, openModal, watch, closeModal } = useModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const { openGlobalModal, watchGlobalModal, changeGlobalModalOptions } = useGlobalModalList({
    mode: { resistBackgroundClick: false, resistESC: false, scrollable: true },
  });

  const { isModalOpen, modalRef, toggleModal } = useToggleModal({
    initialValue: false,
    openModalOptions: { resistBackgroundClick: true },
  });

  const modalWatcher = watch({ modalKey: ['test'] });
  const modalWatcher2 = watch({ modalKey: ['test', 2] });
  const globalModalWatcher = watchGlobalModal({ modalKey: ['test'] });

  useEffect(() => {
    console.log(modalWatcher);
  }, [modalWatcher]);

  useEffect(() => {
    console.log(modalWatcher2);
  }, [modalWatcher2]);

  useEffect(() => {
    console.log(globalModalWatcher);
  }, [globalModalWatcher]);

  const openModal1 = () => {
    openModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: { name: '1' },
      options: { resistBackgroundClick: true },
    });
  };

  const openModal2 = () => {
    openModal({
      modalKey: ['test', 2],
      ModalComponent: TestModal,
      modalProps: { name: '1' },
      options: { resistBackgroundClick: [['test']] },
    });
  };

  const openModal3 = () => {
    openModal({
      modalKey: ['test', 2, 'noprops'],
      ModalComponent: NoPropsModal,
      options: { resistBackgroundClick: [['test'], ['test', 2]] },
    });
  };

  const openGlobalModal1 = () => {
    openGlobalModal({
      modalKey: ['test'],
      ModalComponent: TestModal,
      modalProps: {
        name: '1',
        makeUnScrollable: () =>
          changeGlobalModalOptions({ modalKey: ['test'], optionsToUpdate: { scrollable: false } }),
      },
      options: { resistBackgroundClick: false },
    });
  };

  const killTestModals = () => {
    closeModal({ modalKey: ['test'] });
  };

  const killTestModal2 = () => {
    closeModal({ modalKey: ['test', 2], exact: true });
  };

  return (
    <div>
      <ModalComponentList />
      {isModalOpen && (
        <div ref={modalRef}>
          <h1>Modal</h1>
          <button onClick={toggleModal}>Close Modal</button>
        </div>
      )}
      <button type='button' onClick={forceUpdate}>
        rerender
      </button>
      <button type='button' onClick={killTestModals}>
        kill TestModals
      </button>
      <button type='button' onClick={killTestModal2}>
        kill TestModal2
      </button>
      <button type='button' onClick={openModal1}>
        Open Modal 1
      </button>
      <button type='button' onClick={openModal2}>
        Open Modal 2
      </button>
      <button type='button' onClick={openModal3}>
        Open Modal 3
      </button>
      <button type='button' onClick={openGlobalModal1}>
        Open scrollable Global Modal 1
      </button>
      <button type='button' onClick={toggleModal}>
        Toggle Modal
      </button>
      <p>
        Est qui labore minim laborum est adipisicing ad excepteur proident Lorem pariatur occaecat. Minim tempor do ea
        sunt laboris qui aliqua excepteur officia dolor Lorem elit eiusmod commodo. Deserunt sint tempor id deserunt
        proident nulla incididunt elit ad. Aliqua excepteur do voluptate commodo nisi sunt. Et aliqua cupidatat dolore
        dolore incididunt nostrud ea do commodo elit excepteur deserunt. Non laborum laboris ad officia ullamco fugiat
        id excepteur aute mollit. Dolore tempor culpa labore minim nulla culpa id sit et commodo velit nisi officia non.
        Quis fugiat duis est laboris minim aute in. Qui pariatur veniam ut aute esse adipisicing voluptate sit voluptate
        et qui adipisicing officia.
        <br />
        Pariatur anim est minim commodo laborum sit exercitation id consequat id magna deserunt qui ut. Ea dolor culpa
        aliqua dolore anim laboris qui excepteur nisi consequat in. Consectetur excepteur voluptate dolor minim laborum
        enim do labore nostrud occaecat. Est in dolore do fugiat amet occaecat dolor quis. Excepteur officia eu
        cupidatat ut officia consequat sit sunt amet dolor in dolor. Aliqua sint cillum et eu adipisicing amet ex velit
        ea. Dolor ut quis consectetur tempor aute. Nisi proident amet proident occaecat occaecat sint cillum nostrud
        fugiat non aliqua aliqua. Sint esse elit dolor sint aliqua eu voluptate commodo voluptate magna esse. Sint
        eiusmod ea ullamco consequat esse sint nisi cillum et officia mollit dolore enim occaecat. Laboris adipisicing
        ipsum mollit est exercitation irure aliquip labore nulla velit aliqua Lorem incididunt. Cillum est reprehenderit
        nisi nostrud sint et sunt. Do eiusmod ad eiusmod ullamco nisi nostrud deserunt nulla proident fugiat et aliqua
        do velit. Esse duis sint excepteur occaecat Lorem Lorem est culpa nulla ullamco. Irure est aute ullamco ex. Eu
        ullamco quis voluptate reprehenderit. Occaecat sunt excepteur ad aliquip cupidatat. Anim nisi consectetur do et
        enim cupidatat reprehenderit officia commodo excepteur occaecat cupidatat do enim. Dolore amet cupidatat
        proident adipisicing aute ex culpa labore ut. Velit tempor anim sunt ad cillum laborum minim aliqua. Laborum
        tempor veniam irure cillum ex in enim non quis officia commodo enim. Irure ullamco tempor aliquip Lorem do ad
        id. Irure nulla qui incididunt ea ad velit magna velit. Ea dolor nisi et esse consectetur mollit fugiat pariatur
        cillum esse. Ad nisi consectetur magna in ipsum tempor do eiusmod non ut. Laborum in adipisicing sunt tempor
        Lorem enim enim quis ut culpa dolore sunt ipsum. Voluptate nisi minim minim pariatur consectetur proident.
        Officia do aliqua anim incididunt id culpa. Duis in esse cillum reprehenderit exercitation. Do sunt commodo
        Lorem et. Ex ad in proident dolor dolor occaecat. Officia ut adipisicing anim velit. Aliqua aute irure cupidatat
        nulla esse et sunt amet fugiat proident. Et ea voluptate commodo ea ex voluptate consectetur in. Dolore labore
        adipisicing aliquip eu. Fugiat in anim elit exercitation ad id nisi ullamco nostrud minim aute voluptate eiusmod
        sunt. Lorem officia aliquip deserunt cillum commodo quis labore fugiat laborum velit dolore minim. Deserunt
        aliquip quis culpa ipsum minim reprehenderit esse nisi adipisicing elit Lorem mollit. Qui labore dolor anim amet
        quis nulla do. Nisi commodo enim cupidatat non laboris aute nulla incididunt pariatur eu aute laborum veniam
        excepteur. Amet sunt ex exercitation cillum minim qui. Commodo dolore aute sit amet exercitation velit excepteur
        ipsum Lorem eiusmod. Do velit ex laboris amet consectetur do dolore nulla tempor. Laboris deserunt enim dolore
        qui adipisicing Lorem cupidatat officia. Ad nisi exercitation magna magna sint duis consectetur consectetur
        cillum eiusmod. Exercitation id fugiat reprehenderit exercitation et eu. Excepteur nisi tempor est adipisicing.
        Duis minim cillum aliquip consequat et ea in in. Exercitation ullamco ipsum consequat non sit ut mollit
        proident. Est elit do quis enim minim tempor aliquip consequat ullamco.
        <br />
        Consequat sit adipisicing cupidatat enim irure anim. Adipisicing eiusmod quis quis aliquip veniam eu cillum
        voluptate velit ad. Aute consectetur laborum non ipsum nulla. Lorem laboris amet elit consectetur amet do
        laboris ipsum pariatur. Aliqua laboris do laboris est eu. Cillum duis id culpa voluptate. Dolor aliqua sunt sint
        elit nisi anim ex mollit laboris nisi do elit. Nulla ut consectetur esse quis occaecat ex. Deserunt commodo qui
        do velit velit do qui do. Aliqua voluptate ullamco consequat minim in ea culpa nisi est consectetur velit
        veniam. Dolor sunt ipsum proident eiusmod mollit irure et non eiusmod nisi. Lorem incididunt nostrud sit ullamco
        eu fugiat consectetur tempor sunt. Est ullamco et sit velit ipsum. Anim aliquip elit dolor cupidatat dolor Lorem
        Lorem labore non occaecat pariatur elit laborum ex. Ullamco proident reprehenderit ea incididunt magna do amet
        qui anim cupidatat sunt veniam est. Velit ipsum non incididunt cillum eu. Elit deserunt enim anim ea voluptate
        officia cupidatat in mollit. Exercitation laboris adipisicing fugiat qui in. Commodo cillum culpa qui
        exercitation minim ullamco occaecat id amet consequat laboris et sint magna. Eiusmod voluptate pariatur dolore
        ea consectetur exercitation enim ea aliqua ullamco cillum laborum nostrud. Sunt proident nostrud et excepteur
        sit ut exercitation do amet sit ex occaecat ut ut. Ut mollit eiusmod ipsum Lorem sunt tempor mollit. In nostrud
        non consequat exercitation. Aliquip labore nisi velit anim nostrud officia ullamco ad incididunt quis officia
        tempor commodo pariatur. Id reprehenderit laboris velit commodo aliqua deserunt irure ipsum ipsum nulla aliquip
        anim reprehenderit duis. Nostrud non non sunt sint est est officia officia reprehenderit anim. Ad et cillum
        aliqua do non excepteur quis eu amet. Fugiat proident dolor consectetur deserunt incididunt nulla adipisicing ea
        cillum commodo. Exercitation velit non consequat est minim proident fugiat qui mollit ad magna. Mollit amet duis
        occaecat non nostrud excepteur in id. Veniam sint consequat dolore aliqua exercitation anim irure dolor
        incididunt aute sit nisi veniam.
        <br />
        Pariatur tempor dolore do id cupidatat ea aliquip. Proident consequat duis non consequat ea tempor exercitation
        adipisicing nisi non minim sint commodo. Ea nulla Lorem ullamco enim Lorem velit elit sint occaecat. Laborum
        proident nostrud elit tempor magna laboris tempor velit ullamco ea. Amet est excepteur laborum ex voluptate
        laborum nulla tempor. Cupidatat irure ullamco fugiat cillum amet mollit nisi. Do pariatur cupidatat Lorem est
        enim sunt laboris laboris. Magna et id pariatur tempor ad aute dolore fugiat eu. Est magna ad mollit proident
        fugiat non deserunt nulla aliqua cupidatat et amet. Duis cillum fugiat consectetur non nulla. Et proident mollit
        enim ad ipsum ipsum ex elit. Laboris sit ad aliquip dolor. Veniam ipsum voluptate dolore reprehenderit Lorem
        duis dolore. Laboris minim officia tempor id. Est quis elit laborum quis consectetur officia incididunt. Sint
        Lorem mollit est reprehenderit enim reprehenderit commodo. Ullamco ex duis commodo anim cillum exercitation
        culpa magna tempor reprehenderit. Eiusmod irure pariatur esse ipsum aliquip in elit dolor exercitation magna
        reprehenderit. Deserunt nulla adipisicing deserunt sit voluptate occaecat excepteur sunt elit minim voluptate
        consectetur tempor non. Enim labore anim deserunt excepteur adipisicing ex voluptate. Quis occaecat anim
        proident ad. Eiusmod velit ea exercitation dolore sit occaecat pariatur elit irure ullamco amet culpa fugiat
        non. Duis incididunt sint occaecat enim reprehenderit ipsum dolor tempor. Eiusmod culpa aute excepteur elit eu
        proident ea. Quis ex sit in sunt velit ad sint non minim tempor proident aliquip adipisicing. In non laborum
        labore non occaecat. In laborum do officia exercitation. Aliquip mollit ut sit aliquip reprehenderit elit ut
        veniam. Sint reprehenderit commodo laboris aute reprehenderit proident cupidatat sint quis. Lorem mollit laborum
        voluptate est esse ad. Et ullamco quis ut incididunt reprehenderit fugiat. Dolor ullamco adipisicing officia
        deserunt ad sit magna incididunt eiusmod consequat Lorem mollit. Adipisicing pariatur irure exercitation minim
        minim eu velit incididunt enim ipsum adipisicing. Cupidatat laboris ipsum culpa minim dolore consectetur
        proident in commodo pariatur ullamco nulla. Aliquip adipisicing duis elit anim deserunt. Nulla aliqua sit fugiat
        adipisicing laborum fugiat. Voluptate duis amet velit quis sunt veniam reprehenderit Lorem excepteur. Pariatur
        occaecat eiusmod id enim cupidatat mollit velit aute consequat id culpa reprehenderit et. Ullamco duis veniam
        consectetur cillum laborum excepteur aliquip anim aliqua irure consectetur. Quis voluptate minim non qui
        consequat dolor nisi sit et.
        <br />
        Do cillum duis irure est et fugiat dolor eu voluptate elit id. Aute enim magna nostrud sint irure ad occaecat
        nostrud. Lorem non deserunt deserunt culpa in elit incididunt consectetur excepteur. Labore minim aute occaecat
        ipsum nostrud ut. Culpa excepteur quis id ad. Fugiat ipsum excepteur laboris laboris anim eiusmod fugiat magna
        ipsum nisi duis voluptate fugiat. Proident consectetur amet consequat qui. Deserunt consequat non nisi eu labore
        sit deserunt eiusmod irure et. Ex sit est laboris reprehenderit velit adipisicing deserunt nostrud do in dolore
        aliqua ad. Amet occaecat cillum enim cillum pariatur minim commodo reprehenderit commodo ullamco. Mollit velit
        eu dolor cillum exercitation voluptate ad sit culpa ex id est. Irure eu eu culpa esse laborum nisi aliqua
        commodo. Eu voluptate deserunt culpa tempor eu dolore consectetur.
      </p>
    </div>
  );
}

export default App;
