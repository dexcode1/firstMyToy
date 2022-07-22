package com.aStatic.excelMethod.excelMaking;

import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddressList;
import org.apache.poi.xssf.usermodel.XSSFDataValidationHelper;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Map;

public class StaticExcelMaker {
	
	final private static int lastRow = 100000;
	
	//엑셀 한글자에 따른 기본 길이
	final private static int standardLen = 300;
	
	//엑셀 cell 길이 구할 때,  데이터 길이 최대 허용치
	final private static int maxDataLen = 15;
	
	
	public static void buildExcel(Map<String, Object> map, String filePath) throws Exception {
		Workbook workbook = new XSSFWorkbook();
		CellStyle headerStyle = workbook.createCellStyle();
		headerStyle.setLocked(true);
		CreationHelper creationHelper = workbook.getCreationHelper();

		// 새로운 sheet를 생성한다.
		Sheet worksheet = workbook.createSheet("데이터"); // 가장 첫번째 줄에 제목을 만든다.
		Row row;
		CellStyle style = workbook.createCellStyle(); // 셀 스타일을 위한 변수
		style.setDataFormat(creationHelper.createDataFormat().getFormat("text"));
		style.setLocked(false);
		String excelName = map.get("excelName").toString();  
		
		if(!excelName.endsWith(".xlsx"))
			excelName += ".xlsx";
			
		//헤더 
		String[] headers = (String[]) map.get("headers"); 
		//row
		JSONArray rows = (JSONArray) map.get("row");
		//key 순서
		String[] keys = (String[]) map.get("keys"); 
		//컬럼별 비율
		double[] cellratio = (double[]) map.get("cellratio"); 
		//각 cell 길이 도출
		double[] collen = getColLenth(headers, rows, cellratio, keys);

		row = worksheet.createRow(0); // 칼럼 길이 설정

		//cell 길이 세팅
		for(int i = 0, len = collen.length; i < len; i++ ) {
			worksheet.setColumnWidth(i, (int) collen[i]); // 3번째 컬럼 넓이 조절
		}
		
		// Cell 색깔, 무늬 채우기
		headerStyle.setFillForegroundColor(HSSFColor.HSSFColorPredefined.LIGHT_YELLOW.getIndex());
		headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
		headerStyle.setBorderTop(BorderStyle.THIN);
		headerStyle.setBorderLeft(BorderStyle.THIN);
		headerStyle.setBorderRight(BorderStyle.THIN);
		headerStyle.setBorderBottom(BorderStyle.THIN);
		headerStyle.setWrapText(true);
	    
		// 헤더 입력
		row = worksheet.createRow(0);
		for(int i = 0, len = headers.length; i < len; i++ ) {
			Cell hCell = row.createCell(i);
			hCell.setCellValue(headers[i]);
			hCell.setCellStyle(headerStyle);
		}
		((XSSFSheet)worksheet).lockInsertColumns(true);
		
		
		/*((XSSFSheet)worksheet).lockFormatColumns(false);
		((XSSFSheet)worksheet).lockInsertRows(false);
		((XSSFSheet)worksheet).lockDeleteRows(false);
		worksheet.protectSheet("passwordExcel"); */
		
		// row 입력
		for(int i = 0, len = rows.length(); i < len; i++) {
			JSONObject job = rows.getJSONObject(i);
			row =	 worksheet.createRow(i + 1); //행 추가
			for(int z = 0, len2 = keys.length; z < len2; z++ ) {
				String key = keys[z];
				String data = "";
				if(!job.isNull(key)) 
					data = job.get(key).toString();
				
				Cell rCell = row.createCell(z);
				rCell.setCellValue(data);
				rCell.setCellStyle(style);
			}
		}
		
		//DataValidation 특정 cell 변경 금지를 설정한다
		getDataValidOpt(worksheet, collen.length);
		
		File file = new File(filePath);
		
		if (file.createNewFile()) {                
			 System.out.println("File created");            
		} else {                
			System.out.println("File already exists");            
		}
		
		FileOutputStream fos = new FileOutputStream(file);
        workbook.write(fos);
        workbook.close();
	}
	
	private static void getDataValidOpt(Sheet worksheet, int collength) {
		XSSFDataValidationHelper validationHelper = new XSSFDataValidationHelper((XSSFSheet) worksheet);
	    DataValidationConstraint listConstraint = validationHelper.createExplicitListConstraint(new String[] {
	    	""
	    });
	    
	    CellRangeAddressList range = new CellRangeAddressList(0, 0, 0, collength-1); //필수로 받아야 하는 헤더
	    CellRangeAddressList emptyRange = new CellRangeAddressList(0, 0, -1, -1); //필수 헤더 외 수정 금지
	    CellRangeAddressList editRange = new CellRangeAddressList(1, lastRow, 0, collength-1); //edit cell
	    CellRangeAddressList prohibitionRange = new CellRangeAddressList(1, lastRow, -1, -1); // 나머지는 금지 영역

	    DataValidation dataValidation = validationHelper.createValidation(listConstraint, range);
	    DataValidation dataValidation2 = validationHelper.createValidation(listConstraint, emptyRange);
	    DataValidation dataValidation3 = validationHelper.createValidation(listConstraint, editRange);
	    DataValidation dataValidation4 = validationHelper.createValidation(listConstraint, prohibitionRange);
	    
	    dataValidation3.setSuppressDropDownArrow(false);
	    dataValidation3.setErrorStyle(DataValidation.ErrorStyle.INFO);
	    dataValidation3.createErrorBox("경고", "분류이름을 변경할 수 없습니다");
	    dataValidation3.setShowErrorBox(false);
	    worksheet.addValidationData(dataValidation3);
	    
	    dataValidation.setSuppressDropDownArrow(false);
	    dataValidation.setErrorStyle(DataValidation.ErrorStyle.STOP);
	    dataValidation.createErrorBox("경고", "분류이름을 변경할 수 없습니다");
	    dataValidation.setShowErrorBox(true);
	    worksheet.addValidationData(dataValidation);
	    
	    dataValidation2.setSuppressDropDownArrow(false);
	    dataValidation2.setErrorStyle(DataValidation.ErrorStyle.STOP);
	    dataValidation2.createErrorBox("경고", "입력할 수 없는 컬럼 입니다");
	    dataValidation2.setShowErrorBox(true);
	    worksheet.addValidationData(dataValidation2);
	    
	    dataValidation4.setSuppressDropDownArrow(false);
	    dataValidation4.setErrorStyle(DataValidation.ErrorStyle.STOP);
	    dataValidation4.createErrorBox("경고", "입력할 수 없는 컬럼 입니다");
	    dataValidation4.setShowErrorBox(true);
	    worksheet.addValidationData(dataValidation4);
	}
	
	//헤더 텍스트, row 텍스트의 길이에 따라서 각 cell의 길이를 구한다.
	private static double[] getColLenth(String[] headers, JSONArray rows, double[] cellratio, String[] keys ) {
		double[] collen = new double[headers.length];
		try {
			for(int i = 0, len = headers.length; i < len; i++) {
				int dataLen = getDataLength(headers[i].length());
				double  cl = standardLen * dataLen  * cellratio[i];
				if(collen[i] < cl)
					collen[i] = cl;
			}
			
			for(int i = 0, len = rows.length(); i < len; i++) {
				JSONObject job = rows.getJSONObject(i);			
				for(int z = 0, len2 = keys.length; z < len2; z++ ) {
					if(job.isNull(keys[z]))
						continue;
							
					int dataLen = getDataLength(job.get(keys[z]).toString().length());
					double  cl = standardLen * dataLen  * cellratio[z];
					if(collen[z] < cl)
						collen[z] = cl;
				}
			}
		
		}catch(Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return collen;
	}

	
	private static int getDataLength(int len) {
		if(len > maxDataLen)
			return maxDataLen;
		
		return len;
	}
}
