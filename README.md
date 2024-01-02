## Szanowny Panie Doktorze

wysyłam Panu mój projekt inżynierski, o którym rozmawialiśmy z początkiem semestru w ramach zaliczenia przedmiotu Grafika Generowana Algorytmicznie. Aplikacja składa się z dwóch cześci - pierwsza to biblioteka z faktyczną implementacją algorytmu ewolucyjnego wraz z potrzebnymi operacjami na plikach graficznych, druga część to aplikacja skryptowa, która stanowi interfejs do kontaktu z biblioteką. Dodatkowo, w na koniec zamieszczam przykłady obrazów wygenerowanych z wykorzystaniem aplikacji, które można było oglądać na Inauguracji Roku Akademickiego w Chorzowie w fizycznej postaci, a aktualnie znajdują się również w Instytucie (z tyłu, za dziekanatem st. niestacjonarnych).

### Wymagania

W celu użycia, przetestowania, zabawy z algorytmem należy użyć drugiej, załączonej części, czyli „genetic-portrait-generator-console-script”. Do poprawnego działania wymagane jest środowisko **Node JS** w wersji **conajmniej 16**. oraz menedżer pakietów dla Node - **NPM w wersji 8^**.

### Instalacja i uruchamianie (ręcznie)

Na początku należy zainstalować biblioteki korzystając z komendy:

```bash
npm install
```
a następnie skompilować pliki TypeScript do JavaScript komendą:

```bash
npm run build
```
Skrypt udostępnia komendę:
```bash
npm run scan
```
która w parametrze może przyjąć nazwę pliku, np.: `npm run scan C`.

### Instalacja i uruchamianie (Docker)

Budowanie obrazu

```bash
docker build -t generator .
```

Odpalenie komendy do generacji (`moj_folder` należy zamienić na nazwę folderu, w którym znajduje się plik ***.jpg** oraz ***.json**)

```bash
docker run -t generator npm run scan moj_folder
```


W celu poprawnego wykorzystania aplikacji należy w folderze public/image-queue umieścić folder o nazwie np.: moj-obraz, z dwoma plikami: moj-obraz.jpg oraz moj-obraz.json. W tym samym folderze znajdują się inne, przykładowe wsady, a w folderze public/image-ready odpowiadające im wyniki.

Na co należy zwrócić uwagę, to fakt, że algorytm przyjmuje obrazy **tylko w formacie jpg**, co wiąże się z kwestią optymalizacji i uproszczenia obsługi plików wejściowych, gdzie zrezygnowałem z konieczności rozpoznawania rozszerzeń plików.

### Parametryzacja:
Algorytm przyjmuje wiele zmiennych konfiguracyjnych, poniżej postaram się nakreślić rolę każdego z nich, ale zachęcam do eksperymentowania z różnymi wartościami:

Parametry ogólne:
- crossoverChance: szansa przeprowadzenia krzyżowania osobników, przyjmuje wartości z przedziału [0,1], domyślnie 0.8,
- mutationChance: szansa przeprowadzenia mutacji osobnika, przyjmuje wartości z przedziału [0,1], domyślnie 0.0001,
- numberOfMixes - liczba iteracji algorytmu ewolucyjnego,
- useRawImage - czy algorytm ma korzystać bezpośrednio z obrazu wejściowego, jeśli „false” zostanie przeprowadzony preprocessing obrazu w celu wykrycia krawędzi i wygenerowana matryca krawędzi, jeśli „true” - za matrycę krawędzi przyjmuje się obraz wejściowy.

#### Parametry populacji (populationConfig):
- maxPoint - maksymalny punkt jaki losowa krzywa może osiągnąć, dotyczy początkowej, losowej populacji. Domyślnie jest to wysokość i szerokość obrazu na wejściu,
- nofPointsMax/nofPointsMin - maksymalna/minimalna liczba punktów pośrednich krzywych Beziera, nie przyjmują domyślnych wartości,
- thicknessMax/thicknessMin - maksymalna/minimalna losowa grubość krzywej, nie przyjmują domyślnej wartości,
- divider - dzielnik kroku krzywych w populacji (im większy, tym większa gęstość rysowanych krzywych, im mniejszy, tym mniej punktów każdej z krzywych zostanie narysowanych),
- size - liczebność populacji początkowej.

#### Parametry obrazu wynikowego:
- scale - skala obrazu względem obrazu wejściowego,
- color - kolor krzywych,
- bgColor - kolor tła,
- lerpColor - czy kolor krzywych ma zanikać - wiąże się z grubością krzywych - jeśli krzywa ma grubość większą niż 1 jednostka, to będzie zanikać na krawędziach.

Przykład:
```json
{
  "crossoverChance": null,
  "mutationChance": null,
  "useRawImage": false,
  "numberOfMixes": 300,
  "populationConfig": {
    "maxPoint": {
      "x": 0,
      "y": 0
    },
    "nofPointsMax": 20,
    "nofPointsMin": 15,
    "thicknessMax": 1,
    "thicknessMin": 1,
    "divider": 150,
    "size": 6000
  },
  "outputImageConfig": {
    "scale": 2,
    "color": "FFFFFF",
    "bgColor": "000000",
    "lerpColor": false
  }
}
```
### Źrodło biblioteki

Projekt źrodłowy biblioteki dostępny jest na [GitHub](https://github.com/michalryngier/genetic-portrait-generator) pod adresem: https://github.com/michalryngier/genetic-portrait-generator

### Przykładowe rezultaty:
Link do [Chmury Google](https://drive.google.com/drive/folders/1XQVqQC8oDsE1Kx29cOKfP7PkacFWToxp?usp=share_link):
https://drive.google.com/drive/folders/1XQVqQC8oDsE1Kx29cOKfP7PkacFWToxp?usp=share_link

