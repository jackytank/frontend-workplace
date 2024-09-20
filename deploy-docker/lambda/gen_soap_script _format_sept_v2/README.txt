1. run the script gen.sh using this command (must using GitBash on Windows or on Linux, CMD won't work)

    bash gen.sh

2. if you want to generate different codlocalita or numero, please put your data into 2 variables in gen.sh
    + numeroList
    + itemCodLocalitaList

2. run these SQL commands to obtain the numeroList or itemCodLocalitaList

    SELECT STRING_AGG(CONCAT('"', ti.ctc_train_no_name, '"'), ' ' ORDER BY ti.ctc_train_no_name) AS numeroList
    FROM train_identification ti;

    SELECT STRING_AGG(CONCAT('"', ms.ctc_station_id::text, '"'), ' ' ORDER BY ms.ctc_station_id) AS itemCodLocalitaList
    FROM managed_station ms;
