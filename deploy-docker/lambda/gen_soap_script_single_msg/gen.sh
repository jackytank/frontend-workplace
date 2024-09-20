#!/bin/bash

numeroList=("T0001" "T0002" "T0003" "T0004" "T0005" "T0006" "T0007" "T0008" "T0009" "T0010" "T0011" "T0012" "T0013" "T0014" "T0015" "T0016" "T0017" "T0018" "T0019" "T0020" "T0021" "T0022" "T0023" "T0024" "T0025" "T0026" "T0027" "T0028" "T0029" "T0030" "T0031" "T0032" "T0033" "T0034" "T0035" "T0036" "T0037" "T0038" "T0039" "T0040" "T0041" "T0042" "T0043" "T0044" "T0045" "T0046" "T0047")
itemCodLocalitaList=("1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "40" "41" "42" "43" "44" "45" "46" "47")

folder="generated_soap_xml_files"
if [ -d "$folder" ]; then
    rm -r "$folder"
fi
mkdir "$folder"

generate_xml() {
    local numero=$1
    local codLocalita=$2
    local eventType=$3
    local tipArrivo=$4
    local tipPartenza=$5

    cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
    xmlns:s0="http://pic.rfi.it/ssdc2pic"
    xmlns:s1="http://microsoft.com/wsdl/types/" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <SOAP-ENV:Body SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s0:SendAndamentoTreni>
            <andamentoTreni xsi:type="s0:AndamentoTreni">
                <codGCMMitt xsi:type="xsd:int">25</codGCMMitt>
                <numSezioneMitt xsi:type="xsd:int">7</numSezioneMitt>
                <dtGenerazione xsi:type="xsd:dateTime">2024-09-18T11:00:08</dtGenerazione>
                <treno xsi:type="s0:Treno">
                    <numero xsi:type="xsd:string">$numero</numero>
                    <dataPartenza xsi:type="xsd:dateTime">2024-09-17</dataPartenza>
                    <codLocalita xsi:type="xsd:int">41</codLocalita>
                </treno>
                <passaggiTreno SOAP-ENC:arrayType="s0:PassaggioTreno[47]" SOAP-ENC:offset="[0]"
                    xsi:type="SOAP-ENC:Array">
                    <item xsi:type="s0:PassaggioTreno">
                        <codLocalita xsi:type="xsd:int">$codLocalita</codLocalita>
                        <dtArrivo xsi:type="xsd:dateTime">2024-09-17T16:50:30</dtArrivo>
                        <scostamentoArrivo xsi:type="xsd:int">3270</scostamentoArrivo>
                        <tipArrivo xsi:type="s1:char">$tipArrivo</tipArrivo>
                        <dtPartenza xsi:type="xsd:dateTime">2024-09-18T10:50:00</dtPartenza>
                        <tipPartenza xsi:type="s1:char">$tipPartenza</tipPartenza>
                        <scostamentoPartenza xsi:type="xsd:int">68040</scostamentoPartenza>
                        <codTrattaSucc xsi:type="xsd:int">1062</codTrattaSucc>
                        <binario xsi:type="s1:char">83</binario>
                        <tipCategoria xsi:type="xsd:int">2</tipCategoria>
                        <tipServizio xsi:type="s1:char">86</tipServizio>
                        <tipClassifica xsi:type="s1:char">79</tipClassifica>
                    </item>
                </passaggiTreno>
            </andamentoTreni>
        </s0:SendAndamentoTreni>
    </SOAP-ENV:Body>
</SOAP-ENV:Envelope>
EOF
}

for numero in "${numeroList[@]}"; do
    for codLocalita in "${itemCodLocalitaList[@]}"; do
        # A
        generate_xml "$numero" "$codLocalita" "A" "82" "82s" > "$folder/${numero}_${codLocalita}_A.xml"
        # D
        generate_xml "$numero" "$codLocalita" "D" "82s" "82" > "$folder/${numero}_${codLocalita}_D.xml"
    done
done

csv_file="$folder/generated_scenario.csv"
echo "time delay,message" > "$csv_file"

for codLocalita in "${itemCodLocalitaList[@]}"; do
    # A
    echo -n "1," >> "$csv_file"
    echo -n "[" >> "$csv_file"
    for numero in "${numeroList[@]}"; do
        echo -n "${numero}_${codLocalita}_A.xml|" >> "$csv_file"
    done
    echo "]" >> "$csv_file"
    
    # D
    echo -n "62," >> "$csv_file"
    echo -n "[" >> "$csv_file"
    for numero in "${numeroList[@]}"; do
        echo -n "${numero}_${codLocalita}_D.xml|" >> "$csv_file"
    done
    echo "]" >> "$csv_file"
done

sed -i 's/|]/]/g' "$csv_file"

echo "XML files and CSV file generated in $folder and $csv_file"

