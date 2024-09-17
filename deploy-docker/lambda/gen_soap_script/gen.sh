#!/bin/bash

numeroList=("T0001" "T0002" "T0003" "T0004" "T0005" "T0006" "T0007" "T0008" "T0009")
itemCodLocalitaList=("1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "40" "41" "42" "43" "44" "45" "46" "47")

num_files=${#numeroList[@]}
num_items=${#itemCodLocalitaList[@]}

output_dir="created_${num_files}_soap_each_${num_items}_items_all_outside_threshold"

# Check if the directory exists, and if so, remove it
if [ -d "$output_dir" ]; then
    echo "Directory $output_dir already exists. Removing it..."
    rm -rf "$output_dir"
fi

mkdir -p "$output_dir"

generate_item() {
    local cod_localita=$1
    cat <<EOF
                    <Item xsi:type="ns1:PassaggioTreno">
                        <codLocalita xsi:type="xsd:int">$cod_localita</codLocalita>
                        <dtArrivo xsi:type="xsd:dateTime">2024-06-24T14:30:00</dtArrivo>
                        <scostamentoArrivo xsi:type="xsd:int">2</scostamentoArrivo>
                        <tipArrivo xmlns:s1="http://microsoft.com/wsdl/types/" xsi:type="s1:char">"R"</tipArrivo>
                        <dtPartenza xsi:type="xsd:dateTime">2024-06-24T14:35:00</dtPartenza>
                        <tipPartenza xmlns:s1="http://microsoft.com/wsdl/types/" xsi:type="s1:char">82</tipPartenza>
                        <scostamentoPartenza xsi:type="xsd:int">3</scostamentoPartenza>
                        <codTrattaSucc xsi:type="xsd:int">0</codTrattaSucc>
                        <codTrattaSucc xsi:type="xsd:int">5262</codTrattaSucc>
                        <binario xmlns:s1="http://microsoft.com/wsdl/types/" xsi:type="s1:char">83</binario>
                        <tipCategoria xsi:type="xsd:int">1</tipCategoria>
                        <tipServizio xmlns:s1="http://microsoft.com/wsdl/types/" xsi:type="s1:char">86</tipServizio>
                        <tipClassifica xmlns:s1="http://microsoft.com/wsdl/types/" xsi:type="s1:char">79</tipClassifica>
                    </Item>
EOF
}

for i in "${!numeroList[@]}"; do
    numero=${numeroList[$i]}
    file_number=$((i + 1))
    output_file="${output_dir}/numero_${numero}.xml"
    cat <<EOF > "$output_file"
<?xml version='1.0' encoding='utf-8'?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
    <soapenv:Body>
        <ns1:SendAndamentoTreni xmlns:ns1="http://pic.rfi.it/ssdc2pic"
            soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <andamentoTreni xsi:type="ns1:AndamentoTreni">
                <codGCMMitt xsi:type="xsd:int">16</codGCMMitt>
                <numSezioneMitt xsi:type="xsd:int">5</numSezioneMitt>
                <dtGenerazione xsi:type="xsd:dateTime">2024-06-26T00:00:08</dtGenerazione>
                <treno xsi:type="ns1:Treno">
                    <numero xsi:type="xsd:string">$numero</numero>
                    <dataPartenza xsi:type="xsd:dateTime">2024-06-25</dataPartenza>
                    <codLocalita xsi:type="xsd:int">11235000</codLocalita>
                </treno>
                <passaggiTreno xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
                    soapenc:arrayType="ns1:PassaggioTreno[$num_items]" xsi:type="soapenc:Array">
EOF

    for cod_localita in "${itemCodLocalitaList[@]}"; do
        generate_item "$cod_localita" >> "$output_file"
    done

    cat <<EOF >> "$output_file"
                </passaggiTreno>
            </andamentoTreni>
        </ns1:SendAndamentoTreni>
    </soapenv:Body>
</soapenv:Envelope>
EOF

    echo "Generated $output_file"
done

# gen .csv scenario
csv_file="${output_dir}/generated_scenario.csv"
echo "time delay,message" > "$csv_file"
for numero in "${numeroList[@]}"; do
    echo "1,[numero_${numero}.xml]" >> "$csv_file"
done
echo "Generated $csv_file"
echo "All files have been generated in the '$output_dir' directory, including the CSV file."
