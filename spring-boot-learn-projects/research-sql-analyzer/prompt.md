in spring boot maven I want to create a simple PoC command line based project called CRUD-Analyzer maybe run in main for somehow for simplicity and quickly run, here is the requirement:

- read the src/main/resources/application.yml that look something like this:

```yml
app:
    analyze-config:
        -   filename: 'some_mybatis_file_1.xml'
            methodsToFind: 
                - 'update01'
                - 'select01'
                - 'select03'
        -   filename: 'some_mybatis_file_2.xml'
            methodsToFind: 
                - 'update01'
                - 'select01'
                - 'select03'
```

- find and read mybatis .xml files in src/main/resources/ then analyze in each .xml sql tags only if filename and methodsToFind present in application.yml config
- if detect "select abc.some_column from some_table" then mark some_table as R (read)
    + if "select 1 from some_table" then not mark as R because it not select any column from some_table
    + only mark R if in the statement actually read or doing something with some_table's columns
- if detect "update some_table" then mark some_table as U (update)
- if detect "insert into some_table" then mark some_table as C (create)
- if detect "delete from some_table" then mark some_table as D (delete)
- one table maximum marked as CRUD because in some cases one table could be multiple operations, for example "delete from some_table where exists in (select stab.some_col from some_table)"

then produce a single .json files that contain multiple info about the analysis, below is my idea:

{
    file: "${a mybatis .xml file absolute path}" // ex: "c:/path/to/some_file.xml"
    methods: [
        {
            name: "update01" // the tag id in sql tags, ex: <update id="update01">
            analysis: [
                {
                    "${table_name_1}": "${operations of table_name_1}" // Ex: "SOME_TABLE": "CR"
                }
            ]
        }
    ]
}

*note about the implementation requirement:
1. here is example of a tag in .xml mybatis file #1:
  <sql id="Entity_Column_List">
      COLUMN_1, -- Comment for column 1
    COLUMN_2, -- Comment for column 2
    COLUMN_3, -- Comment for column 3
    COLUMN_4, -- Comment for column 4
    COLUMN_5, -- Comment for column 5
    COLUMN_6, -- Comment for column 6
    COLUMN_7, -- Comment for column 7
    COLUMN_8, -- Comment for column 8
    COLUMN_9, -- Comment for column 9
    COLUMN_10, -- Comment for column 10
    COLUMN_11, -- Comment for column 11
    COLUMN_12, -- Comment for column 12
    COLUMN_13, -- Comment for column 13
    COLUMN_14, -- Comment for column 14
    COLUMN_15, -- Comment for column 15
    COLUMN_16, -- Comment for column 16
    COLUMN_17, -- Comment for column 17
    COLUMN_18, -- Comment for column 18
    COLUMN_19, -- Comment for column 19
    COLUMN_20, -- Comment for column 20
    COLUMN_21, -- Comment for column 21
    COLUMN_22, -- Comment for column 22
    TO_CHAR(CREATED_DATE,'yyyyMMdd'), -- Created timestamp
    TO_CHAR(UPDATED_DATE,'yyyyMMdd') -- Updated timestamp
  </sql>
  <select id="selectByKeyListForUpdate"
    parameterType="com.example.entity.MasterEntity"
    resultMap="MasterEntityResultMap">
    select
      <include refid="Entity_Column_List" />
    from
      MASTER_TABLE
    where (KEY_COL_1, KEY_COL_2, KEY_COL_3)
      IN
      <foreach item="item" index="index" collection="list" open="(" close=")">
        <if test="index%1000 == 0 and index!=0">) OR (KEY_COL_1, KEY_COL_2, KEY_COL_3) IN (</if>
        <if test="index%1000 != 0">,</if>
        (#{item.keyCol1,jdbcType=CHAR}, #{item.keyCol2,jdbcType=CHAR}, #{item.keyCol3,jdbcType=CHAR})
      </foreach>
    for update nowait
  </select>
- expected: MASTER_TABLE is R because we can assumed it is R because of <sql> tag "Entity_Column_List" that selecting some columns out and probably from MASTER_TABLE

2. here is example of a tag in .xml mybatis file #2:

  <update id="updatePattern01">
    <![CDATA[
    update TABLE_A
       set STATUS_CODE = '8'
          ,UPDATED_DATE = TO_CHAR(SYSDATE,'YYYYMMDD')
          ,UPDATED_TIME = TO_CHAR(SYSTIMESTAMP,'hh24missff6')
    where exists (
      select 1
      from TABLE_A CAU
      join (
        select
           to_char(add_months(to_date(concat(NKS.YEAR_COL,NKS.MONTH_COL), 'YYYYMM'),-1),'YYYYMM') as YM -- Year-Month
          ,NKS.DATE_COL -- Date column
        from TABLE_B NKS
        where NKS.CODE = '0001'
          and NKS.SCHEDULE_CODE = #{scdCode, jdbcType=CHAR}
          and NKS.DATE_TYPE = 'D0011'
      ) D0011
      on D0011.YM = CAU.CALC_MONTH
      where D0011.DATE_COL < #{businessDay, jdbcType=CHAR} -- Business day filter
        and CAU.STATUS_CODE = '0'
        and CAU.REG_NUMBER = TABLE_A.REG_NUMBER
    )
    ]]>
  </update>

- expected: 
    + TABLE_B is R because in the subquery it actually select some column from TABLE_B NKS
    + TABLE_A is U: and not RU because "select 1 from TABLE_A CAU" didn't select any column from TABLE_A


3. prioritize dedicated and potentially helpful libraries for this project over full-blown regex-based