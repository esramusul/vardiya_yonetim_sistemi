module Api
  module V1
    class ShiftsController < ApplicationController
      before_action :set_shift, only: [:show, :update, :destroy]

      def index
        shifts = Shift.includes(:shift_template, :department, :employees).all
        shifts = shifts.where(work_date: params[:date]) if params[:date].present?
        render json: shifts.as_json(include: [:shift_template, :department, :employees])
      end

      def show
        render json: @shift.as_json(include: [:shift_template, :department, :employees])
      end

      def create
        shift = Shift.new(shift_params)
        if shift.save
          render json: shift, status: :created
        else
          render json: { errors: shift.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @shift.update(shift_params)
          render json: @shift
        else
          render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @shift.destroy
        head :no_content
      end

      private

      def set_shift
        @shift = Shift.find(params[:id])
      end

      def shift_params
        params.require(:shift).permit(:work_date, :department_id, :shift_template_id)
      end
    end
  end
end
